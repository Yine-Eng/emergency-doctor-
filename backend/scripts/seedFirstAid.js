import axios from "axios";
import cheerio from "cheerio";
import crypto from "crypto";
import dotenv from "dotenv";
import mongoose from "mongoose";
import FirstAidGuide from "../models/FirstAidGuide.js";

dotenv.config();

const SOURCES = [
  {
    name: "Red Cross",
    url: "https://www.redcross.org.uk/first-aid/learn-first-aid",
    parse: async (html) => {
      const $ = cheerio.load(html);
      const guides = [];
      $(".first-aid-list__item").each((_, el) => {
        const condition = $(el).find(".first-aid-list__title").text().trim();
        const steps = [];
        $(el)
          .find(".first-aid-list__steps li")
          .each((_, li) => steps.push($(li).text().trim()));
        if (condition && steps.length) {
          guides.push({
            condition,
            steps,
            source: "https://www.redcross.org.uk/first-aid/learn-first-aid",
          });
        }
      });
      return guides;
    },
  },
  {
    name: "NHS",
    url: "https://www.nhs.uk/conditions/first-aid/",
    parse: async (html) => {
      const $ = cheerio.load(html);
      const guides = [];
      $(".nhsuk-card").each((_, el) => {
        const condition = $(el).find(".nhsuk-card__heading").text().trim();
        const steps = [];
        $(el)
          .find(".nhsuk-list li")
          .each((_, li) => steps.push($(li).text().trim()));
        if (condition && steps.length) {
          guides.push({
            condition,
            steps,
            source: "https://www.nhs.uk/conditions/first-aid/",
          });
        }
      });
      return guides;
    },
  },
];

const hashGuide = (guide) =>
  crypto
    .createHash("sha256")
    .update(JSON.stringify({ condition: guide.condition, steps: guide.steps }))
    .digest("hex");

const upsertGuides = async (guides) => {
  let updated = 0;
  for (const guide of guides) {
    const existing = await FirstAidGuide.findOne({ condition: guide.condition });
    const newHash = hashGuide(guide);
    if (!existing) {
      await FirstAidGuide.create(guide);
      updated++;
      console.log(`Added: ${guide.condition}`);
    } else {
      const oldHash = hashGuide(existing);
      if (oldHash !== newHash) {
        await FirstAidGuide.updateOne({ _id: existing._id }, guide);
        updated++;
        console.log(`Updated: ${guide.condition}`);
      }
    }
  }
  return updated;
};

const main = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
    let allGuides = [];
    for (const src of SOURCES) {
      console.log(`Fetching from ${src.name}...`);
      const { data } = await axios.get(src.url);
      const guides = await src.parse(data);
      allGuides = allGuides.concat(guides);
    }
    // Deduplicate by condition
    const uniqueGuides = Object.values(
      allGuides.reduce((acc, g) => {
        acc[g.condition] = g;
        return acc;
      }, {})
    );
    const updated = await upsertGuides(uniqueGuides);
    console.log(`Done. ${updated} guides added/updated.`);
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
};

main(); 
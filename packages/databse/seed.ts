import { PrismaClient } from "./generated/prisma/client.js";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const pass = await bcrypt.hash("RamisDaddy", 10);
  const user = await prisma.user.upsert({
    where: {
      username: "ramanshu",
    },
    update: {},
    create: {
      username: "ramanshu",
      name: "Ramanshu Sharan Mishra",
      password: pass,
      email: "ramanshumishra256@gmail.com",
    },
  });
  console.log("user ramanshu added");

  const avatars = [
    {
      name: "coder",
      image: "noimage",
    },
    {
      name: "gorgyGirl",
      image: "noImage",
    },
    {
      name: "coolBoy",
      image: "noImage",
    },
    {
      name: "auraDaddy",
      image: "noImage",
    },
  ];

  // Use Promise.all with map instead of forEach
  await Promise.all(
    avatars.map(async (avatar) => {
      await prisma.avatar.upsert({
        where: {
          name: avatar.name,
        },
        update: {},
        create: {
          image: avatar.image,
          name: avatar.name,
        },
      });
    })
  );
  console.log("avatars added");

  const defaultMaps = [
    {
      name: "Cafe",
      image: "noImage",
      thumbnail: "/assets/map-cafe.jpg",
      height: 360 * 32,
      width: 360 * 32,
    },
    {
      name: "Office",
      image: "noImage",
      thumbnail: "/assets/map-office.jpg",
      height: 360 * 32,
      width: 360 * 32,
    },
    {
      name: "Park",
      image: "noImage",
      thumbnail: "/assets/map-park.jpg",
      height: 360 * 32,
      width: 360 * 32,
    },
    {
      name: "Conference",
      image: "noImage",
      thumbnail: "/assets/map-conference.jpg",
      height: 360 * 32,
      width: 360 * 32,
    },
  ];

  await Promise.all(
    defaultMaps.map(async (map) => {
      await prisma.defaultMap.upsert({
        where: {
          name: map.name,
        },
        update: {},
        create: {
          name: map.name,
          image: map.image,
          thumbnail: map.thumbnail,
          height: map.height,
          width: map.width,
        },
      });
    })
  );
  console.log("default maps added");

  const elements = [
    {
      type: "chair",
      variant: "metal",
      image: "noImage",
      height: 16,
      width: 16,
    },
    {
      type: "table",
      variant: "wooden",
      image: "noImage",
      height: 16,
      width: 16,
    },
    {
      type: "table",
      variant: "metal",
      image: "noImage",
      height: 16,
      width: 16,
    },
  ];

  await Promise.all(
    elements.map(async (element) => {
      await prisma.element.upsert({
        where: {
          type_variant: {
            type: element.type,
            variant: element.variant,
          },
        },
        update: {},
        create: {
          type: element.type,
          variant: element.variant,
          image: element.image,
          height: element.height,
          width: element.width,
        },
      });
    })
  );
  console.log("Elements added");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.log((e as Error).message);
    await prisma.$disconnect();
    process.exit(1);
  });

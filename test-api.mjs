import {
  getAllBreeds,
  getRandomDogImage,
  getRandomDogImages,
  getBreedImages,
  getRandomImageByBreed,
  getSubBreedImages,
} from "./src/services/dogService.js";

async function testAPI() {
  try {
    console.log("=== PAWHAVEN API TEST ===\n");

    const breeds = await getAllBreeds();
    console.log("Total breeds:", Object.keys(breeds).length);

    const randomImage = await getRandomDogImage();
    console.log("Random image:", randomImage);

    const randomImages = await getRandomDogImages(5);
    console.log("Random images:", randomImages.length);

    const huskyImages = await getBreedImages("husky");
    console.log("Husky images:", huskyImages.length);

    const huskyImage = await getRandomImageByBreed("husky");
    console.log("Random husky image:", huskyImage);

    const subBreedImages = await getSubBreedImages(
      "hound",
      "afghan"
    );
    console.log("Afghan hound images:", subBreedImages.length);

    console.log("\nAll API tests passed!");
  } catch (error) {
    console.error("\nAPI TEST FAILED");
    console.error(error.message);
    process.exitCode = 1;
  }
}

testAPI();

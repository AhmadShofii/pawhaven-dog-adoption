import api from "./Api.js";

const getResponseData = (response) => {
  if (response.data.status !== "success") {
    throw new Error("Gagal mengambil data Dog CEO API.");
  }

  return response.data.message;
};

export const getAllBreeds = async () => {
  const response = await api.get("/breeds/list/all");
  return getResponseData(response);
};

export const getRandomDogImage = async () => {
  const response = await api.get("/breeds/image/random");
  return getResponseData(response);
};

export const getRandomDogImages = async (count = 12) => {
  const total = Math.max(1, Math.min(50, Number(count) || 12));

  const response = await api.get(`/breeds/image/random/${total}`);

  return getResponseData(response);
};

export const getBreedImages = async (breed) => {
  if (!breed) {
    throw new Error("Nama ras wajib diisi.");
  }

  const response = await api.get(`/breed/${encodeURIComponent(breed)}/images`);

  return getResponseData(response);
};

export const getRandomImageByBreed = async (breed) => {
  if (!breed) {
    throw new Error("Nama ras wajib diisi.");
  }

  const response = await api.get(
    `/breed/${encodeURIComponent(breed)}/images/random`,
  );

  return getResponseData(response);
};

export const getSubBreedImages = async (breed, subBreed) => {
  if (!breed || !subBreed) {
    throw new Error("Breed dan sub-breed wajib diisi.");
  }

  const response = await api.get(
    `/breed/${encodeURIComponent(breed)}/${encodeURIComponent(subBreed)}/images`,
  );

  return getResponseData(response);
};

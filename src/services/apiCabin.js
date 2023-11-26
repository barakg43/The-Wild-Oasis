import supabase, { supabaseUrl } from "./supabase";
const cabinsStr =
  '[{"id":1,"created_at":"2023-11-16T12:46:20.505207+00:00","name":"001","maxCapacity":2,"regularPrice":250,"discount":50,"description":"Small luxury cabin in the woods","image":"https://vhcmwngsztplmeuuiivv.supabase.co/storage/v1/object/public/cabin-images/cabin-001.jpg"},{"id":20,"created_at":"2023-11-21T18:58:12.590702+00:00","name":"32","maxCapacity":23,"regularPrice":4081,"discount":0,"description":"343","image":"https://vhcmwngsztplmeuuiivv.supabase.co/storage/v1/object/public/cabin-images/0.2286015998651838-cabin-007.jpg"},{"id":26,"created_at":"2023-11-23T09:31:08.822288+00:00","name":"Copy of 32","maxCapacity":23,"regularPrice":4081,"discount":1,"description":"343","image":"https://vhcmwngsztplmeuuiivv.supabase.co/storage/v1/object/public/cabin-images/0.2286015998651838-cabin-007.jpg"},{"id":29,"created_at":"2023-11-24T06:47:10.842135+00:00","name":"fsefwswf","maxCapacity":4524,"regularPrice":45,"discount":45,"description":"ergg","image":"https://vhcmwngsztplmeuuiivv.supabase.co/storage/v1/object/public/cabin-images/0.15515767140503067-cabin-004.jpg"}]';

export async function getCabins() {
  const { data, error } = await supabase.from("cabins").select("*");
  if (error) {
    console.error(error);
    throw new Error("Cabin could not be loaded");
  }
  // const data = JSON.parse(cabinsStr);
  // console.log(JSON.stringify(data));
  return data;
}

export async function deleteCabin(id) {
  const { error } = await supabase.from("cabins").delete().eq("id", id);
  if (error) {
    console.error(error);
    throw new Error("Cabins could not be delete");
  }
}

export async function createEditCabin(newCabin, id) {
  const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);
  const imageName = `${Math.random()}-${newCabin.image?.name}`.replaceAll(
    "/",
    ""
  );
  const imagePath = hasImagePath
    ? newCabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  // 1. Create/edit cabin
  let query = supabase.from("cabins");
  // A) CREATE
  if (!id) query = query.insert([{ ...newCabin, image: imagePath }]);
  // B) EDIT
  else {
    query = query.update({ ...newCabin, image: imagePath }).eq("id", id);
  }

  const { data, error } = await query.select().single();

  if (error) {
    console.error(error);
    const errorMsg = id
      ? "Cabin could not edited"
      : "Cabin could not be created";
    throw new Error(errorMsg);
  }

  // 2. Upload image
  if (hasImagePath) return data;

  const { error: storageError } = await supabase.storage
    .from("cabin-images")
    .upload(imageName, newCabin.image);

  // 3. Delete the cabin IF there was an error uploading image
  if (storageError) {
    await supabase.from("cabins").delete().eq("id", data.id);
    console.error(storageError);
    throw new Error(
      "Cabin image could not be uploaded and the cabin was not created"
    );
  }

  return data;
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("subject").del();
  await knex("subject").insert([
    { id_subject: 1, bidang: "UI UX" },
    { id_subject: 2, bidang: "Software Engineer" },
    { id_subject: 3, bidang: "Cyber Security" },
    { id_subject: 4, bidang: "Data Science" },
    { id_subject: 5, bidang: "Bussines Analyst" },
  ]);
};

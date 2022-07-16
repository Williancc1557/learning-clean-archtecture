import type { Router } from "express";

export default (router: Router): void => {
  console.log("teste");

  router.post("/signup", (req, res) => {
    res.json({ ok: "ok" });
  });
};

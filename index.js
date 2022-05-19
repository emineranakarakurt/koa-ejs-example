const Koa = require("koa");
const Router = require("koa-router");
const logger = require("koa-logger");
const bodyParser = require("koa-bodyparser");
const static = require('koa-static');
const render = require("koa-ejs");
const path = require("path");

const PORT = process.env.PORT || 8000;

const app = new Koa();
const router = new Router();

app.use(
  static(__dirname + '/public/')
);

// my error handler
const errorHandler = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = 400;
    ctx.err = err;
    ctx.body = `errorHandler: ${err.message}`;
  }
};

app.use(errorHandler);

render(app, {
  root: path.join(__dirname, "views"),
  layout: 'layout',
  viewExt: "ejs",
  cache: false,
  debug: true
});

function renderTemplate(path, file){
  router.get(path, async (ctx) => {
    await ctx.render(file);
  })
}

router.get("/", async (ctx) => {
  await ctx.render("langue");
  
});
router.get("/didactiel", async (ctx) => {
  await ctx.render("didactiel");
});
router.get("/connexion", async (ctx) => {
  await ctx.render("connexion");
});
router.get("/openorcreate", async (ctx) => {
  await ctx.render("openorcreate");
});
router.get("/openproject", async (ctx) => {
  await ctx.render("openproject");
});
router.get("/createproject", async (ctx) => {
  await ctx.render("createproject");
});
router.get("/projectsolo", async (ctx) => {
  await ctx.render("projectsolo");
});
router.get("/projectduo", async (ctx) => {
  await ctx.render("projectduo");
});
router.get("/generatedata", async (ctx) => {
  await ctx.render("generatedata");
});
router.get("/datapanel", async (ctx) => {
  await ctx.render("datapanel");
});
router.get("/classification", async (ctx) => {
  await ctx.render("classification");
});
router.get("/results-projection-panel", async (ctx) => {
  await ctx.render("results-projection-panel");
});
router.get("/results-cardinality", async (ctx) => {
  await ctx.render("results-cardinality");
});
router.get("/results-centroids", async (ctx) => {
  await ctx.render("results-centroids");
});
router.get("/results-evaluation", async (ctx) => {
  await ctx.render("results-evaluation");
});

router.get("/results-historique", async (ctx) => {
  await ctx.render("results-historique");
});
router.get("/results-image", async (ctx) => {
  await ctx.render("results-image");
});
router.get("/results-scatter-plot", async (ctx) => {
  await ctx.render("results-scatter-plot");
});
router.get("/results-similarity", async (ctx) => {
  await ctx.render("results-similarity");
});
router.get("/results-weights", async (ctx) => {
  await ctx.render("results-weights");
});
app
  .use(logger())
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(PORT, "0.0.0.0", () =>
    console.log(`listening on http://localhost:${PORT}...`)
  );

const Koa = require("koa");
const Router = require("koa-router");
const logger = require("koa-logger");
const bodyParser = require("koa-bodyparser");
const mount = require('koa-mount');
const static = require('koa-static');
const render = require("koa-ejs");
const path = require("path");
const url = require('url');

const PORT = process.env.PORT || 80;

const app = new Koa();
const router = new Router();

app.use(async (ctx, next)=> {
  const parsedUrl = url.parse(ctx.url);
  if (
      (parsedUrl.pathname === '/register') || 
      (parsedUrl.pathname === '/login')
  ) {
      parsedUrl.pathname = parsedUrl.pathname + '/'
      ctx.redirect(url.format(parsedUrl));
      return
  }

  await next();
});

app.use(
  mount('/', require('./src/app'))
);

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

renderTemplate("/", "langue");
renderTemplate("/didactiel", "didactiel"); 
renderTemplate("/connexion", "connexion"); 
renderTemplate("/openorcreate", "openorcreate"); 
renderTemplate("/openproject", "openproject"); 
renderTemplate("/createproject", "createproject"); 
renderTemplate("/projectsolo", "projectsolo"); 
renderTemplate("/projectduo", "projectduo"); 
renderTemplate("/generatedata", "generatedata"); 
renderTemplate("/datapanel", "datapanel"); 
renderTemplate("/classification", "classification"); 
renderTemplate("/results-projection-panel", "results-projection-panel"); 
renderTemplate("/results-cardinality", "results-cardinality"); 
renderTemplate("/results-centroids", "results-centroids"); 
renderTemplate("/results-evaluation", "results-evaluation"); 
renderTemplate("/results-historique", "results-historique"); 
renderTemplate("/results-image", "results-image"); 
renderTemplate("/results-scatter-plot", "results-scatter-plot"); 
renderTemplate("/results-similarity", "results-similarity"); 
renderTemplate("/results-weights", "results-weights"); 
renderTemplate("/compare", "compare"); 
app
  .use(logger())
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(PORT, "0.0.0.0", () =>
    console.log(`listening on http://localhost:${PORT}...`)
  );

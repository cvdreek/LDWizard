import { default as Ratt, middleware } from "@triply/ratt";
import { Util } from "n3";

const prefixes = {
  rdf: Util.prefix("http://www.w3.org/1999/02/22-rdf-syntax-ns#"),
  schema: Util.prefix("http://schema.org/"),
};

function main() {
  const app = new Ratt();

  app.use(middleware.readCsv("./output/example-1.trig", { delimiter: ";" }));
  app.use(middleware.convertToNamedNode("id", "http://example.org/character/"));
  app.use(
    middleware.cleanColumn("male", male => {
      if (male === "0") { return "sex-F"; } else { return "sex-M"; }
    })
  );
  app.use(middleware.setDatatype("male", "xsd:string"));
  app.use(middleware.addQuad("id", prefixes.rdf("type"), prefixes.schema("Person")));
  app.use(middleware.addQuad("id", prefixes.schema("gender"), "male"));


  app.use(
    middleware.writeToFile("output/example-1.trig", {
      compress: false,
      type: "trig"
    })
  );
  app.run().catch((e: Error) => console.log(e));
}

main();

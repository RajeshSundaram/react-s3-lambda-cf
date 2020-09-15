"use strict";

const app = require("../../app.js");
const chai = require("chai");
const expect = chai.expect;
var event, context;

describe("Tests index", function () {
  it("should responde with bad request", async () => {
    event = { body: JSON.stringify({}) };
    const result = await app.lambdaHandler(event, context);
    expect(result).to.be.an("object");
    expect(result.statusCode).to.equal(400);
  });
});

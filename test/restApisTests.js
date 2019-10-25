var assert = require("assert");
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../app");

let should = chai.should();
chai.use(chaiHttp);

/**
 * Product Tests
 */
describe("Products", function() {
  describe("Testing the product filters for both coffee machine and pods", function() {
    it("Should be able to get all products", done => {
      // Get All Prodcuts
      chai
        .request(server)
        .get("/coffee/get/")
        .set("Content-Type", "application/json")
        .end((err, res) => {
          var checkObj = {
            data: [
              "CM001",
              "CM002",
              "CM003",
              "CM101",
              "CM102",
              "CM103",
              "EM001",
              "EM002",
              "EM003",
              "CP001",
              "CP003",
              "CP003",
              "CP011",
              "CP013",
              "CP021",
              "CP023",
              "CP031",
              "CP033",
              "CP041",
              "CP043",
              "CP101",
              "CP103",
              "CP111",
              "CP113",
              "CP121",
              "CP123",
              "CP131",
              "CP133",
              "CP141",
              "CP143",
              "EP003",
              "EP005",
              "EP007",
              "EP013",
              "EP015",
              "EP017"
            ]
          };

          // Check for returned result
          res.body.should.be.eql(checkObj);
          // console.log (result);
          done();
        });
    });

    it("Should be able to return all espresso machines", done => {
      // Get All espressso machines
      chai
        .request(server)
        .get("/coffee/get/?product_type=ESPRESSO_MACHINE")
        .set("Content-Type", "application/json")
        .end((err, res) => {
          var checkObj = {
            data: ["EM001", "EM002", "EM003"]
          };

          // Check for returned result
          res.body.should.be.eql(checkObj);
          // console.log (result);
          done();
        });
    });

    it("should get all small pods", done => {
      // Get All espressso machines
      chai
        .request(server)
        .get("/coffee/get/?product_type=POD_SMALL")
        .set("Content-Type", "application/json")
        .end((err, res) => {
          var checkObj = {
            data: [
              "CP001",
              "CP003",
              "CP003",
              "CP011",
              "CP013",
              "CP021",
              "CP023",
              "CP031",
              "CP033",
              "CP041",
              "CP043"
            ]
          };

          // Check for returned result
          res.body.should.be.eql(checkObj);
          done();
        });
    });

    it("should get all pods sold in 7 dozens pack (84)", done => {
      // Get All espressso machines
      chai
        .request(server)
        .get("/coffee/get/?product_type=POD&pack_size=84")
        .set("Content-Type", "application/json")
        .end((err, res) => {
          var checkObj = {
            data: ["EP007", "EP017"]
          };

          // Check for returned result
          res.body.should.be.eql(checkObj);
          done();
        });
    });
  });
});

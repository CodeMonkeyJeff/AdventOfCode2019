// "use strict";

// import assert = require("assert");
// import {Graph, Vertex, Edge} from "../src/Util/Graph";

// describe("Graph Tests", function(): void {
//     describe("ctor", function() {
//         const graph = new Graph();

//         it("Empty Vertex List", function() {
//             assert.equal(0, graph.Vertices.length);
//         });

//         it("Default Graph Options", function() {
//             assert.equal(true, graph.IsUndirectedGraph);
//             assert.equal(true, graph.KeepLowestEdgeWeights);
//         });
//     });

//     describe("Vertex Tests", function() {
//         const AVertex = new Vertex<string>("A", "A");
//         const BVertex = new Vertex<string>("B", "B");

//         describe("ctor", function() {
//             const vertex = new Vertex("A");
    
//             it("Name is A", function() {
//                 assert.equal("A", vertex.Name);
//             });
//         });

//         describe("Add Vertices", function() {
//             const tests = [
//                 { name:  "Add None", toAdd: [], result: [] },
//                 { name:  "Add One", toAdd: [AVertex], result: [AVertex] },
//                 { name:  "Add Two", toAdd: [AVertex, BVertex], result: [AVertex, BVertex] },
//             ];

//             tests.forEach((test): void => {
//                 it(test.name, function() {
//                     const graph = new Graph();
//                     test.toAdd.forEach(v => { graph.AddVertex(v.Name); });
//                     assert.deepEqual(test.result, graph.Vertices);
//                 });
//             });
//         });

//         describe("Remove Vertices", function() {
//             const tests = [
//                 { name: "Remove One", toAdd: [AVertex, BVertex], toRemove: [BVertex], result: [AVertex] },
//             ];

//             tests.forEach((test): void => {
//                 it(test.name, function() {
//                     const graph = new Graph();
//                     test.toAdd.forEach(v => { graph.AddVertex(v.Name); });
//                     test.toRemove.forEach(v => { graph.RemoveVertex(v.Name); });
//                     assert.deepEqual(test.result, graph.Vertices);
//                 });
//             });
//         });

//         describe("Has Vertex", function() {
//             const tests = [
//                 { name: "Has A", toAdd: [AVertex], toTest: AVertex, result: true },
//                 { name: "Empty No A", toAdd: [], toTest: AVertex, result: false },
//                 { name: "Nonempty No A", toAdd: [BVertex], toTest: AVertex, result: false }
//             ];

//             tests.forEach((test): void => {
//                 it(test.name, function() {
//                     const graph = new Graph();
//                     test.toAdd.forEach(v => { graph.AddVertex(v.Name); });
//                     assert.equal(test.result, graph.HasVertex(test.toTest.Name));
//                 });
//             });
//         });

//     });

//     describe("Edge Tests", function() {
//         const AB = ["A","B"];
//         const BA = ["B","A"];
//         const BC = ["B","C"];
//         const CB = ["C","B"];
//         const AC = ["A","C"];
//         const CA = ["C","A"];

//         describe("ctor", function() {
//             const tests = [
//                 {start: "A", end: "B", weight: 1},
//                 {start: "B", end: "A", weight: 88},
//             ];

//             tests.forEach(test => {
//                 it(test.start + test.end + "Weight " + test.weight, function() {
//                     const edge = new Edge(test.start, test.end, test.weight);
//                     assert.equal(test.start, edge.Start);
//                     assert.equal(test.end, edge.End);
//                     assert.equal(test.weight, edge.Weight);
//                 });
//             });
//         });

//         describe("Add Edges", function() {
//             const tests = [
//                 { name: "AB", edges: [AB], result: [AB, BA] },
//                 { name: "AB, BC", edges: [AB, BC], result: [AB, BA, BC, CB] },
//                 { name: "AB, BC, AC", edges: [AB, BC, AC], result: [AB, BA, BC, CB, AC, CA] },
//                 { name: "AB, BC, AB", edges: [AB, BC, AB], result: [AB, BA, BC, CB] },
//             ];

//             tests.forEach(test => {
//                 it(test.name, function() {
//                     const graph = new Graph();
//                     test.edges.forEach(e => graph.AddEdge(e[0], e[1]));
//                     assert.equal(test.result.length, graph.Edges.length);
//                     test.result.forEach(e => assert.equal(true, graph.HasEdge(e[0],e[1])));
//                 });
//             })
//         });
//     });
// });
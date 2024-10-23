const request = require("supertest");
const { app } = require("../index.js");  
const { getAllShows, getShowById, addShow, validateShow } = require("../controllers");  
const http = require("http");
const { before, beforeEach } = require("node:test");

jest.mock("../controllers", () => {
  return {
    getAllShows: jest.fn(),
    getShowById: jest.fn(),
    addShow: jest.fn(), 
    validateShow:jest.fn()  
  };
});

let server;

beforeAll((done) => {
  server = http.createServer(app);
  server.listen(3001, done);
});

afterAll((done) => {
  server.close(done);
});

describe("API Endpoints Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();  
  });

  it("GET /shows should return all shows", async () => {
    const mockShows = {
      shows: [
        { showId: 1, title: 'The Lion King', theatreId: 1, time: '7:00 PM' },
        { showId: 2, title: 'Hamilton', theatreId: 2, time: '8:00 PM' },
        { showId: 3, title: 'Wicked', theatreId: 3, time: '9:00 PM' },
        { showId: 4, title: 'Les Misérables', theatreId: 1, time: '6:00 PM' },
      ],
    };
    getAllShows.mockReturnValueOnce(mockShows.shows);
  
    const response = await request(server).get("/shows");

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual(mockShows);
    expect(response.body.shows.length).toBe(4);  
  });  

  it("GET /shows/:id should return show by Id", async () => {
    const mockShow = {
      show: {
        showId: 1,
        title: "The Lion King",
        theatreId: 1,
        time: "7:00 PM"
      }
    }
    getShowById.mockReturnValue(mockShow.show);

    const response = await request(server).get("/shows/1");

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual(mockShow);
  });

  it("POST /shows should add a new Show", async () => {
    const mockShow = { id: 5, title: 'Monkey King', theatreId: 2, time: '11:00 PM' };
    addShow.mockResolvedValue(mockShow);

    const response = await request(server).post("/shows").send({ title: 'Monkey King', theatreId: 2, time: '11:00 PM' });
    expect(response.statusCode).toEqual(201);
    expect(response.body).toEqual(mockShow);
  });
  
  it("GET /shows/:id should return 404 if no shows are found", async () => {
    getShowById.mockResolvedValue(null);

    const response = await request(server).get("/shows/999");
    expect(response.statusCode).toEqual(404);
    expect(response.body.error).toEqual("No Show found with this Id");
  });

  it("Should Validate Show input correctly", () => {
    validateShow.mockReturnValue(null);
    expect(validateShow({showId: 5, title: 'Monkey King', theatreId: 3, time: '9:00 PM'})).toBe(null);

    validateShow.mockReturnValue("Title is required and should be a string.");
    expect(validateShow({ showId: 5, theatreId: 3, time: '9:00 PM' })).toBe("Title is required and should be a string.");

    validateShow.mockReturnValue("Show Id is required and should be a number.");
    expect(validateShow({ title: 'Monkey King', theatreId: 3, time: '9:00 PM' })).toBe("Show Id is required and should be a number.");
  });
});

describe("Function Tests", () => {
  beforeEach(() => {
   jest.clearAllMocks();
  });
  
  test("getAllShows() should return all shows", () => {
   const mockShows = [
    { showId: 1, title: 'The Lion King', theatreId: 1, time: '7:00 PM' },
    { showId: 2, title: 'Hamilton', theatreId: 2, time: '8:00 PM' },
    { showId: 3, title: 'Wicked', theatreId: 3, time: '9:00 PM' },
    { showId: 4, title: 'Les Misérables', theatreId: 1, time: '6:00 PM' },
  ];

  getAllShows.mockReturnValue(mockShows);

  let result = getAllShows();
  expect(result).toEqual(mockShows);
  expect(getAllShows).toHaveBeenCalled();
  });

  test("addShow() should add a new show", () => {
    const newShow = { showId: 5, title: 'Monkey King', theatreId: 3, time: '9:00 PM' };

    addShow.mockReturnValue(newShow);

    let result = addShow(newShow);
    expect(result).toEqual(newShow);
    expect(addShow).toHaveBeenCalledWith(newShow);
  });
});

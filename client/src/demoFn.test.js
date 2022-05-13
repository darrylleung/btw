const myMockFn = jest.fn((n) => n * 2);

test("testing that map calls our mock function correctly", () => {
    const a = [10, 20, 30, 64];

    a.map(myMockFn);

    console.log("myMockFn.mock: ", myMockFn.mock);
    //my mock property of my mocked function gives me insights to how my function was called/behaved. we can check whether my function was called as many times as i think it should have been.

    expect(myMockFn.mock.calls.length).toBe(a.length);
    //i can still check for value outcome
    expect(myMockFn.mock.results[3].value).toBe(128);
    //check if map got all correct vals the first time it ran
    expect(myMockFn.mock.calls[0]).toEqual([10, 0, a]);
});

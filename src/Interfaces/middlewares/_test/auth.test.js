import authenticateToken from "../auth.js";
import AuthenticationError from "../../../Commons/exceptions/AuthenticationError.js";

describe("authenticateToken function", () => {
  it("should throw invalid signature Error when token is not valid", async () => {
    const req = {
      headers: {
        authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30",
      },
    };
    const res = {};
    const next = vi.fn();

    await expect(authenticateToken(req, res, next)).rejects.toThrowError(
      new AuthenticationError("invalid signature"),
    );
  });

  it("should throw missing Authentication Error when token is missing", async () => {
    const req = {
      headers: {
        authorization: "",
      },
    };
    const res = {};
    const next = vi.fn();

    await expect(authenticateToken(req, res, next)).rejects.toThrowError(
      new AuthenticationError("Missing authentication"),
    );
  });
});

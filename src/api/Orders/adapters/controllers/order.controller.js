module.exports.createOrderHandler = (deps, presenters) => {
    return async (req, res) => {
      try {
        const data = deps.validateCreateOrderRequest(req.body);
        const payload = await deps.createOrderRequest(data);
        presenters.ok(res, payload, 201);
      } catch (error) {
        presenters.error(res, error);
      }
    };
  };
  
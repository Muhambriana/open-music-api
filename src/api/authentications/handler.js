class AuthenticationsHandler {
  constructor(authenticationsService, usersService, tokenManager, validato) {
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;

  }
}
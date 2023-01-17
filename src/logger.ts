export default class Logger {

	private readonly consoleLogEnabled = true;
	private static _instance: Logger;
	private _log: string;

	constructor() {
		this._log = '';
	}

	public static get instance(): Logger {
		if (!Logger._instance) {
			Logger._instance = new Logger();
		}
		return Logger._instance;
	}

	public log(...args: any[]) {
		if (this.consoleLogEnabled) {
			console.log("[DEBUG]", ...args);
		}
		this._log += args.join("") + '\n';
	}

	public info(...args: any[]) {
		this.log("INFO:",...args);
	}

	public error(...args: any[]) {
		this.log("ERROR: ",...args);
	}
}

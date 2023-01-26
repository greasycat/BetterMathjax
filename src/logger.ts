export default class Logger {

	private readonly consoleLogEnabled = true;
	private static _instance: Logger;

	constructor() {
	}

	public static get instance(): Logger {
		if (!Logger._instance) {
			Logger._instance = new Logger();
		}
		return Logger._instance;
	}

	private log(...args: any[]) {
		console.log("[DEBUG]",new Date().toLocaleTimeString(), ...args);
	}

	public info(...args: any[]) {
		if (this.consoleLogEnabled) {
			this.log("INFO:",...args);
		}
	}

	public error(...args: any[]) {
		if (this.consoleLogEnabled) {
			this.log("ERROR: ", ...args);
		}
	}
}

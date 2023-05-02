export default class Logger {

	private consoleLogEnabled: boolean;
	private static _instance: Logger;

	constructor() {
	}

	public static get instance(): Logger {
		if (!Logger._instance) {
			Logger._instance = new Logger();
		}
		return Logger._instance;
	}
	public setConsoleLogEnabled(enabled: boolean) {
		this.consoleLogEnabled = enabled;
		this.info("BetterMathjax Debug Log Enabled:", enabled)
	}
	private log(...args: unknown[]) {
		console.log("[DEBUG]",new Date().toLocaleTimeString(), ...args);
	}

	public info(...args: unknown[]) {
		if (this.consoleLogEnabled) {
			this.log("INFO:",...args);
		}
	}

	public error(...args: unknown[]) {
		this.log("ERROR: ", ...args);
	}
}

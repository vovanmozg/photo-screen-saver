import * as electron from "electron";

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

var mainWindow: Electron.BrowserWindow = null;

// Quit when all windows are closed.
app.on("window-all-closed", () =>
{
	app.quit();
});

app.on("ready", () =>
{
	if(process.argv.length > 1)
	{
		// The /p option tells us to display the screen saver in the tiny preview window in the Screen Saver Settings dialog.
		if(process.argv[1] === "/p")
		{
			app.quit();
			return;
		}

		// The /S option is passed when the user chooses Configure from the .scr file context menu (although we don't see this in practice).
		// The /c:# option is passed when the user clicks Settings... in the Screen Saver Settings dialog.
		if((process.argv[1] === "/S")
		|| process.argv[1].match(/^\/c/))
		{
			electron.dialog.showMessageBox({ message: "This screen saver has no options that you can set.", buttons: [ "OK" ] });
			app.quit();
			return;
		}

		//electron.dialog.showMessageBox({ message: process.argv.join("\n"), buttons: [ "OK" ] });
	}

	mainWindow = new BrowserWindow({ show: false, autoHideMenuBar: true, webPreferences: { nodeIntegration: true } });
	mainWindow.loadURL("file://" + __dirname + "/index.html");
	mainWindow.on("closed", () => { mainWindow = null });
	//mainWindow.webContents.openDevTools();

	// Normally we could set show, kiosk, and alwaysOnTop to true in the BrowserWindow options.
	// We have to do this after a brief delay so that the CSS cursor:none will take effect
	// without the user having to move the mouse, and to avoid a flash of white screen while
	// the page initially paints.
	setTimeout(() => 
	{
		mainWindow.setKiosk(true);
		mainWindow.setAlwaysOnTop(true);
		mainWindow.show();
	}, 2000);
});

var wmi = require('node-wmi');
const { app, BrowserWindow } = require('electron')
const path = require('path')

var win;
function createWindow () {
  win = new BrowserWindow({
    width: 800,
    height: 840,
    frame: false, 
    transparent: false,
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      }
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

var sensors;
var indexes = [41, 6, 7, 36, 37, 27, 15, 46, 17, 40, 2, 13, 34, 25, 33, 32, 14, 16, 39]
function get_sensors() {
    wmi.Query({
        namespace: 'root/OpenHardwareMonitor',
        class: 'sensor'
    }, function(err, stats) {
        // console.log(stats);
        sensors = stats;
    });
    JSON.stringify(sensors);
    // console.log('Sensors Updated');
}

function display_stats(sensors) {
    var send = [];
    for (i = 0; i < indexes.length; i++){
        send.push(sensors[indexes[i]]);
    }
    win.webContents.send('sensor-data', send);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function update(time) {
    while (true) {
        get_sensors();
        await sleep(time);
        display_stats(sensors);
    }   
}
update(1000);
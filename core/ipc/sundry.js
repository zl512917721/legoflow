'use strict';

const webSetting = require('../common/web_setting');
const threadKiller = require('../common/thread_killer');
const updater = require('../common/updater');
const chromeOpenUrl = require('../common/chrome_open_url');

let app, mainWindow, settingWindow;

module.exports = ( _app, _mainWindow, _settingWindow ) => {
    app = _app, mainWindow = _mainWindow; settingWindow = _settingWindow;
}

const electron = require('electron');

const ipc = electron.ipcMain;

// 应用重启
ipc.on( 'APP_RESTART', ( event ) => {
    threadKiller( );

    app.relaunch( );
    app.exit( 0 );
} )

// 停止全部工作流进程
ipc.on( 'THREAD_KILL', ( event ) => {
    threadKiller( );
} )

// 最小化应用窗口
ipc.on( 'MAIN_WINDOW_MIN', ( ) => mainWindow.minimize( ) );

// 显示应用窗口
ipc.on( 'MAIN_WINDOW_SHOW', ( ) => mainWindow.show( ) );

// 隐藏应用窗口
ipc.on( 'MAIN_WINDOW_HIDE', ( ) => mainWindow.hide( ) );

// 隐藏设置窗口
ipc.on( 'SETTING_WINDOW_HIDE', ( ) => settingWindow.hide( ) );

// 显示设置窗口
ipc.on( 'SETTING_WINDOW_SHOW', ( ) => settingWindow.show( ) );

// 更新配置
ipc.on( 'UPDATE_CONFIG', async ( event ) => {
    await webSetting.updateConfig( );
} );

// 使用 chrome 打开
ipc.on( 'UTIL_CHROME_OPEN', ( event, url ) => {
    chromeOpenUrl( url );
} )

ipc.on( 'APP_CHECK_UPDATE', async ( event ) => {
    const { version, isNeedUpdate } = await updater.check( );

    if ( isNeedUpdate ) {
        mainWindow.webContents.send( 'CAN_UPDATE', { version } );
    }
} );

ipc.on( 'UPDATE', async ( event ) => {
    const tips = [
        '下载更新包...',
        '解压中...',
    ];

    let step = 0;

    updater.updating( ( msg, progress ) => {
        mainWindow.webContents.send( 'UPDATE', { type: 'ing', msg: tips[ step ] || '保存中...' } );

        ++step;
    } )

    updater.update( ).then( ( ) => {
        mainWindow.webContents.send( 'UPDATE', { type: 'success' } );
    } ).catch( ( e ) => {
        mainWindow.webContents.send( 'UPDATE', { type: 'fail', msg: `更新失败: ${ e }` } );
    } )
} )

ipc.on( 'MAIN_WINDOW_OPEN_DEV_TOOLS', ( event ) => {
    mainWindow.webContents.openDevTools( { mode: 'undocked' });
} )

'use strict';

const USER = '@user';
const PORT = '@port';
const EDITOR = '@editor';
const AUTO_OPEN_CHROME = '@autoOpenChrome';
const PROJECT = '@project';

if ( !window.localStorage[ USER ] ) {
    window.localStorage[ USER ] = '';
}

if ( !window.localStorage[ PORT ] ) {
    window.localStorage[ PORT ] = '3000';
}

if ( !window.localStorage[ EDITOR ] ) {
    window.localStorage[ EDITOR ] = 'VSCode';
}

if ( !window.localStorage[ AUTO_OPEN_CHROME ] ) {
    window.localStorage[ AUTO_OPEN_CHROME ] = 'true';
}

if ( !window.localStorage[ PROJECT ] ) {
    window.localStorage[ PROJECT ] = '[]';
}

window.appSetting = {
    get ( key ) {
        switch ( key ) {
            case 'user': return window.localStorage[ USER ];
            case 'port': return window.localStorage[ PORT ];
            case 'editor': return window.localStorage[ EDITOR ];
            case 'autoOpenChrome': return JSON.parse( window.localStorage[ AUTO_OPEN_CHROME ] );
            case 'project': return JSON.parse( window.localStorage[ PROJECT ] );
            default:
                return {
                    user: window.localStorage[ USER ],
                    port: window.localStorage[ PORT ],
                    editor: window.localStorage[ EDITOR ],
                    autoOpenChrome: JSON.parse( window.localStorage[ AUTO_OPEN_CHROME ] ),
                    project: JSON.parse( window.localStorage[ PROJECT ] ),
                };
        }
    },
    set ( key, value ) {
        switch ( key ) {
            case 'user': window.localStorage[ USER ] = value;
            case 'port': window.localStorage[ PORT ] = value;
            case 'editor': window.localStorage[ EDITOR ] = value;
            case 'autoOpenChrome': window.localStorage[ AUTO_OPEN_CHROME ] = value;
            case 'project': window.localStorage[ PROJECT ] = JSON.stringify( value );
        }

        window.ipc.updateConfig( );
    },
    clear ( ) {
        delete window.localStorage[ USER ];
        delete window.localStorage[ PORT ];
        delete window.localStorage[ EDITOR ];
        delete window.localStorage[ AUTO_OPEN_CHROME ];
        delete window.localStorage[ PROJECT ];
    },
}

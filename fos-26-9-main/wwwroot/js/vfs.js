/*
*   FILE: "vfs.js"
*   AUTHOR: $Creator.0\tg <tgreen.dev@outlook.com>
*   SUMMARY: IndexedDB-backed Virtual File System for FelisOS.
*/

class FelisVFS {
    constructor() {
        this.dbName = 'Local.vfs';
        this.version = 1;
        this.db = null;
    }

    async mount() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('filesystem')) {
                    // Create the primary store with the filepath as the key
                    const store = db.createObjectStore('filesystem', { keyPath: 'path' });
                    store.createIndex('type', 'type', { unique: false }); // 'file' or 'directory'
                    store.createIndex('parent', 'parent', { unique: false });
                }
            };

            request.onsuccess = async (event) => {
                this.db = event.target.result;
                await this.initializeCoreDirectories();
                console.log('[FelisOS VFS] Mounted successfully.');
                resolve();
            };

            request.onerror = (event) => reject(event.target.error);
        });
    }
    /* ----
     * VirtualFileSystem
     * ----
     * - Sections A, B, and C are defined below to organize the filesystem structure. 
     * */
    async initializeCoreDirectories() {
        // Establishes the foundational directory tree; Thus, our VFS begins...
        const corePaths = [

           /* ---- A.) SYSTEM ROOT AND CORE ----
            *                                                              (!)
            * + ["$ root/"]                                                   - Not user-accessible.
            *      "$ root/temp/", "$ root/sys-core/"                         - Normal users will never need to access this directly.
            * 
            * ----- ----- */

            '$ root/', // Root directory for the virtual filesystem. 
            '$ root/temp/', // Temporary files and directories created by apps and games. Cleared on system restart or user logout.
            '$ root/sys-core/',
            '$ root/sys-core/sys-images/', // Used for remote system recovery and updates.
            '$ root/sys-core/sys-config/', // System configuration files, applicable device settings.

           /* ---- B.) LOCAL USER DATA AND APPLICATIONS ----
            *                                                               (!)
            * + ["$ root/local/"]                                              - User-accessible directories begin here.
            *      "$ root/local/accounts-sessions/",                          - Limited access and modification privileges.
            *      "$ root/local/apps/"
            * 
            * ---- ---- */

            '$ root/local/',
            '$ root/local/accounts-sessions/', // User account and session data storage (read-only). Password-protected.
            '$ root/local/apps/', // User-installed and FelisOS applications and their data.
            '$ root/local/apps/savestates/', // Game save files and related data storage for user-installed games.
            '$ root/local/apps/savestates/config/', // Game save configuration files.

            /* ---- C.) LOCAL USER DATA AND PERSONAL FILES ----
             *
             * + ["$ root/local/userdata/"]
             *      "$ root/local/userdata/desktop/",
             *      "$ root/local/userdata/multimedia/",                    (!)
             *      "$ root/local/userdata/documents/",                        - User's personal files and data storage.
             *      "$ root/local/userdata/downloads/",                        - Full access privileges for the user start here.
             *      "$ root/local/userdata/developer/.../"
             * 
             * ---- ---- */

            '$ root/local/userdata/',
            '$ root/local/userdata/desktop/', // User's desktop files, folders and shortcuts.
            '$ root/local/userdata/multimedia/',
            '$ root/local/userdata/multimedia/pictures/',
            '$ root/local/userdata/multimedia/videos/',
            '$ root/local/userdata/multimedia/music/',
            '$ root/local/userdata/documents/',
            '$ root/local/userdata/downloads/',
            '$ root/local/userdata/developer/', // User's development files and projects.
            '$ root/local/userdata/developer/projects/', // User's development projects and source code.
            '$ root/local/userdata/developer/scripts/', // User's development scripts and automation files.
            '$ root/local/userdata/developer/tools/' // User's development tools and utilities.
        ];

        for (const path of corePaths) {
            await this.createDirectory(path);
        }
    }

    async createDirectory(path) {
        return this.writeNode({
            path: path,
            type: 'directory',
            parent: path.substring(0, path.lastIndexOf('/', path.length - 2) + 1) || null,
            created: Date.now()
        });
    }

    async writeFile(path, content, mimeType = 'text/plain') {
        return this.writeNode({
            path: path,
            type: 'file',
            content: content,
            mimeType: mimeType,
            parent: path.substring(0, path.lastIndexOf('/') + 1),
            modified: Date.now()
        });
    }

    writeNode(nodeData) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['filesystem'], 'readwrite');
            const store = transaction.objectStore('filesystem');
            const request = store.put(nodeData);

            request.onsuccess = () => resolve();
            request.onerror = (e) => reject(e.target.error);
        });
    }
}

// Expose globally for Storage Explorer and Scribe
window.vfs = new FelisVFS();
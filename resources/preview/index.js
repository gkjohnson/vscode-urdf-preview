/* globals THREE */
const urdfcontent = document.querySelector('[type="urdf-content"]').innerText;
const el = document.querySelector('urdf-viewer');

// removes '..' and '.' tokens and normalizes slashes
const cleanFilePath = path => {

    return path
        .replace(/\\/g, '/')
        .split(/\//g)
        .reduce((acc, el) => {

            if (el === '..') acc.pop();
            else if (el !== '.') acc.push(el);
            return acc;

        }, [])
        .join('/');

};

const urdfBlobUrl = URL.createObjectURL(new Blob([urdfcontent]));
const fileNames = window.__files.map(n => cleanFilePath(n));
const modelLoader = new THREE.ModelLoader(el.loadingManager);
el.urdfLoader.defaultMeshLoader = (path, ext, done) => modelLoader.load(path, res => done(res.model));
el.loadingManager.setURLModifier(url => {

    if (urdfBlobUrl === url) {

        return url;

    } else {

        const rawUrl = url.replace(/^blob:file:[\\/]{3}/, '');
        const cleaned = cleanFilePath(rawUrl);
        const res = fileNames
            .filter(f => f.indexOf(cleaned) === f.length - cleaned.length)
            .pop();

        return 'file://' + res;

    }

});

el.urdf = urdfBlobUrl;
el.camera.position.set(5, 5, 5);
el.directionalLight.shadow.bias = -0.0001;

window.addEventListener('focus', () => el.recenter());
window.addEventListener('resize', () => el.recenter());

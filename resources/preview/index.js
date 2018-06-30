/* globals THREE */
const urdfcontent = document.querySelector('[type="urdf-content"]').innerText;
const el = document.querySelector('urdf-viewer');

const modelLoader = new THREE.ModelLoader(el.loadingManager);
el.urdfLoader.defaultMeshLoader = (path, ext, done) => modelLoader.load(path, res => done(res.model));
el.loadingManager.setURLModifier(url => {

    if (url.indexOf('blob:') !== -1) {

        return url.replace(/^dummy-package\//, '').replace('file:/', 'file:///');

    } else {

        const cleaned = url.replace(/^dummy-package\//, '').replace(/\//g, '\\');
        const res = window.__files
            .filter(f => f.indexOf(cleaned) === f.length - cleaned.length)
            .pop();

        return 'file://' + res;

    }

});

el.urdf = URL.createObjectURL(new Blob([urdfcontent]));
el.camera.position.set(5, 5, 5);

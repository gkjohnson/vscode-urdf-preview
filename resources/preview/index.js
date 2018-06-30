const urdfcontent = document.querySelector('[type="urdf-content"]').innerText;
const el = document.querySelector('urdf-viewer');

const modelLoader = new THREE.ModelLoader(el.loadingManager);
el.urdfLoader.defaultMeshLoader = (path, ext, done) => modelLoader.load(path, res => done(res.model));
el.loadingManager.setURLModifier(url => {

    if (url.indexOf('blob:') !== -1) {
        return url.replace(/^dummy-package\//, '').replace('file:/', 'file:///');
    } else {
        return 'file://' + (window.__workspaceURL + '/urdf/' + url.replace(/^dummy-package\//, '')).replace(/\/+/g, '/');
    }

});

el.urdf = URL.createObjectURL(new Blob([urdfcontent]));
el.camera.position.set(5, 5, 5);

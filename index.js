require('./lib/PLYLoader.js');

if (typeof AFRAME === 'undefined') {
	throw new Error('Component attempted to register before AFRAME was available.');
}

/**
 * Point Cloud component for A-Frame.
 */
AFRAME.registerComponent('pointcloud', {
	schema: {
		src: {
			type: 'asset'
		},
		size: {
			type: 'number',
			default: 1
		},
	},

	multiple: false,

	init: function () {

		if (!this.data.src) {
			console.warn("HOW I'M SUPOSSED TO LOAD A POINT CLOUD WITHOUT [%s] `src` DEFINED", this.name);
			return;
		}

		const loader = new THREE.PLYLoader();

		const _this = this;
		loader.load(this.data.src, function (geometry) {
			const material = new THREE.PointsMaterial({
				size: _this.data.size,
				vertexColors: THREE.VertexColors,
			});
			_this.pointcloud = new THREE.Points(geometry, material);
			/* 
			Y in THREE.js is Z in almost all point cloud software so the point cloud must be rotated.
			Do the rotation here and not as html propertie because of the bounding box computation.
			Do the bounding box computation because the centroid of the cloud will be at 0,0,0
			and thus the point cloud must be moved upwards.
			*/
			_this.pointcloud.rotateX(-90);
			_this.pointcloud.geometry.computeBoundingBox();
			const bbox = _this.pointcloud.geometry.boundingBox;
			_this.pointcloud.position.y += (bbox.max.y - bbox.min.y) / 2;

			_this.el.setObject3D('pointcloud', _this.pointcloud);
		});
	},

	remove: function () {},

});
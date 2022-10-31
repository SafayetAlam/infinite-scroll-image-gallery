const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');

let photosArray = [];
let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let pageNum = 1;

// check if all images are loaded
const imageLoaded = () => {
	imagesLoaded++;
	if (imagesLoaded === totalImages) {
		ready = true;
		loader.hidden = true;
	}
};

// helper function to set attributes on DOM elements
const setAttributes = (element, attributes) => {
	for (const key in attributes) {
		element.setAttribute(key, attributes[key]);
	}
};

// create elements for links & photos, and add to DOM
const displayPhotos = (photos) => {
	imagesLoaded = 0;
	totalImages = photos.length;

	// run function for each object in photosArray
	photos.forEach((photo) => {
		// create <a> to link to unsplash
		const item = document.createElement('a');
		setAttributes(item, {
			href: photo.url,
			target: '_blank',
		});
		// create <img> for photo
		const img = document.createElement('img');
		setAttributes(img, {
			src: photo.src.landscape,
			alt: photo.alt,
			title: photo.alt,
		});
		// event listener, check when each is finished loading
		img.addEventListener('load', imageLoaded);
		// put <img> inside <a>
		item.appendChild(img);
		// put item inside imageContainer
		imageContainer.appendChild(item);
	});
};

// get photos from pexels api
const getPhotos = async (pageNum) => {
	let apiKey = `563492ad6f917000010000010ed505fa2a82435c9228bc2bc7eab20a`;
	let apiUrl = `https://api.pexels.com/v1/curated?page=${pageNum}`;
	try {
		const response = await fetch(apiUrl, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				Authorization: apiKey,
			},
		});
		photosArray = await response.json();
		displayPhotos(photosArray.photos);
	} catch (error) {
		console.error(error);
	}
};

// check to see if scrolling near bottom of page, load more photos
window.addEventListener('scroll', () => {
	if (
		window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 &&
		ready
	) {
		pageNum++;
		ready = false;
		getPhotos(pageNum);
	}
});

getPhotos(pageNum);

// smooth scroll nav links

document.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("click", function (event) {
        const target = this.getAttribute("href");

        if (target.startsWith("#")) {
            event.preventDefault();
            document.querySelector(target).scrollIntoView({
                behavior: "smooth"
            });
        }
   });
});

// post management

// Load posts from localStorage
function loadPosts() {
    const posts = JSON.parse(localStorage.getItem("voluntraPosts")) || [];
    displayPosts(posts);
}

// Display posts
function displayPosts(posts) {
    const container = document.getElementById("posts-container");
    container.innerHTML = "";

    if (posts.length === 0) {
        container.innerHTML = "<p>No help requests yet. Check back later!</p>";
        return;
    }

      posts.forEach(post => {
        const postDiv = document.createElement("div");
        postDiv.className = "post";
        postDiv.setAttribute('data-index', posts.indexOf(post));

        const categoryText = post.category.charAt(0).toUpperCase() + post.category.slice(1).replace("-", " ");
        const urgencyText = post.urgency.charAt(0).toUpperCase() + post.urgency.slice(1);

        let imageHtml = '';
        if (post.image && post.image.length > 0) {
            if (post.image.length === 1) {
                imageHtml = `<img src="${post.image[0]}" alt="Help request image" class="post-image single">`;
            } else {
                imageHtml = '<div class="image-collage">';
                const displayCount = Math.min(post.image.length, 4);
                for (let i = 0; i < displayCount; i++) {
                    if (i === 3 && post.image.length > 4) {
                        imageHtml += `<div class="image-item view-more" data-images='${JSON.stringify(post.image)}' data-index="${posts.indexOf(post)}">
                            <img src="${post.image[i]}" alt="Image ${i+1}">
                            <div class="view-more-overlay">View More (+${post.image.length - 3})</div>
                        </div>`;
                    } else {
                        imageHtml += `<div class="image-item">
                            <img src="${post.image[i]}" alt="Image ${i+1}">
                        </div>`;
                    }
                }
                imageHtml += '</div>';
            }
}

const commentsCount = (post.comments || []).length;
        const donationsCount = (post.donations || []).length;
        const volunteersCount = (post.volunteers || []).length;

        postDiv.innerHTML = `
            ${imageHtml}
            ${post.lat && post.lng ? `<div class="post-map" id="map-${posts.indexOf(post)}" style="height: 150px; margin-top: 10px;"></div>` : ''}
            <div class="post-actions">
                <button class="comment-btn" data-index="${posts.indexOf(post)}">💬 Comment (${commentsCount})</button>
                <button class="donate-btn" data-index="${posts.indexOf(post)}">💰 Donate (${donationsCount})</button>
                <button class="volunteer-btn" data-index="${posts.indexOf(post)}">🤝 Volunteer (${volunteersCount})</button>
            </div>
            <h3>${post.name} needs help</h3>
            <p><strong>Category:</strong> ${categoryText}</p>
            <p><strong>Location:</strong> ${post.location}</p>
            <p><strong>Urgency:</strong> ${urgencyText}</p>
            <p><strong>Description:</strong> ${post.description}</p>
            <p class="meta">Posted on ${new Date(post.timestamp).toLocaleString()}</p>
        `;

        container.appendChild(postDiv);

        // Init map if location
        if (post.lat && post.lng) {
            setTimeout(() => {
                const mapId = `map-${posts.indexOf(post)}`;
                const smallMap = L.map(mapId).setView([post.lat, post.lng], 13);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(smallMap);
                L.marker([post.lat, post.lng]).addTo(smallMap);
            }, 100);
        }
    });
}

// Load posts on page load
document.addEventListener("DOMContentLoaded", loadPosts);

// Event handlers for buttons
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('comment-btn')) {
        e.stopPropagation();
        const index = parseInt(e.target.getAttribute('data-index'));
        openCommentModal(index);
    } else if (e.target.classList.contains('donate-btn')) {
        e.stopPropagation();
        const index = parseInt(e.target.getAttribute('data-index'));
        openDonateModal(index);
    } else if (e.target.classList.contains('volunteer-btn')) {
        e.stopPropagation();
        const index = parseInt(e.target.getAttribute('data-index'));
        openVolunteerModal(index);
    } else if (e.target.closest('.view-more')) {
        e.stopPropagation();
        const images = JSON.parse(e.target.closest('.view-more').getAttribute('data-images'));
        showImageGallery(images);
    } else if (e.target.closest('.post')) {
        const postElement = e.target.closest('.post');
        const index = parseInt(postElement.getAttribute('data-index'));
        showPostDetails(index);
    }
});

// Modal functions
function openCommentModal(index) {
    // Implement comment modal
    const modal = document.getElementById('comment-modal');
    modal.style.display = 'block';
    // Set data-index
    modal.setAttribute('data-post-index', index);
}

function openDonateModal(index) {
    const modal = document.getElementById('donate-modal');
    modal.style.display = 'block';
    modal.setAttribute('data-post-index', index);
}

function openVolunteerModal(index) {
    const modal = document.getElementById('volunteer-modal');
    modal.style.display = 'block';
    modal.setAttribute('data-post-index', index);
}

// Show image gallery
function showImageGallery(images) {
    const gallery = document.getElementById('image-gallery');
    gallery.innerHTML = '';

    images.forEach((src, index) => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = `Image ${index + 1}`;
        gallery.appendChild(img);
    });

    document.getElementById('image-modal').style.display = 'block';
}

// Show post details in right panel
function showPostDetails(index) {
    const posts = JSON.parse(localStorage.getItem("voluntraPosts")) || [];
    const post = posts[index];

    let mapHtml = '';
    if (post.lat && post.lng) {
        mapHtml = `<div id="details-map" style="height: 200px; margin: 10px 0;"></div>`;
        setTimeout(() => {
            const detailsMap = L.map('details-map').setView([post.lat, post.lng], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(detailsMap);
            L.marker([post.lat, post.lng]).addTo(detailsMap);
        }, 100);
    }

    const detailsPanel = document.getElementById('post-details');
    detailsPanel.innerHTML = `
        <h3>${post.name}'s Request</h3>
        <p><strong>Description:</strong> ${post.description}</p>
        <p><strong>Location:</strong> ${post.location}</p>
        ${mapHtml}
        <h4>Comments (${(post.comments || []).length})</h4>
        <div class="comments-list">
            ${(post.comments || []).map(comment => `<div class="comment">${comment}</div>`).join('')}
        </div>
        <h4>Donations (${(post.donations || []).length})</h4>
        <div class="donations-list">
            ${(post.donations || []).map(donation => `<div class="donation">${donation}</div>`).join('')}
        </div>
        <h4>Volunteers (${(post.volunteers || []).length})</h4>
        <div class="volunteers-list">
            ${(post.volunteers || []).map(volunteer => `<div class="volunteer">${volunteer}</div>`).join('')}
        </div>
    `;
}


 }); 
 }
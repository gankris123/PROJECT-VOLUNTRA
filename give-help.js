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

// Close modals
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', function() {
        this.closest('.modal').style.display = 'none';
    });
});

// Handle form submissions for actions
document.getElementById('comment-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const index = parseInt(this.closest('.modal').getAttribute('data-post-index'));
    const comment = document.getElementById('comment-text').value.trim();
    const imageFile = document.getElementById('comment-image').files[0];

    if (comment || imageFile) {
        const processComment = imageFile ? [imageFile].map(file => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = () => reject(new Error('Failed to read image'));
                reader.readAsDataURL(file);
            });
        }) : [Promise.resolve(null)];

        Promise.allSettled(processComment).then(results => {
            const imageData = results[0].status === 'fulfilled' ? results[0].value : null;
            const fullComment = imageData ? `${comment}<br><img src="${imageData}" style="max-width:100px;">` : comment;
            addComment(index, fullComment);
            this.reset();
            this.closest('.modal').style.display = 'none';
        });
    }
});

document.getElementById('donate-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const index = parseInt(this.closest('.modal').getAttribute('data-post-index'));
    const type = document.getElementById('donate-type').value;
    const message = document.getElementById('donate-message').value.trim();

    let donationText = '';
    if (type === 'money') {
        const amount = document.getElementById('donate-amount').value;
        const method = document.getElementById('payment-method').value;
        if (amount && method) {
            donationText = `$${amount} via ${method} - ${message || 'No message'}`;
        }
    } else {
        const item = document.getElementById('donate-item').value.trim();
        if (item) {
            donationText = `${type}: ${item} - ${message || 'No message'}`;
        }
    }

    if (donationText) {
        addDonation(index, donationText);
        this.reset();
        document.getElementById('money-options').style.display = 'none';
        document.getElementById('item-options').style.display = 'none';
        this.closest('.modal').style.display = 'none';
    }
});

document.getElementById('volunteer-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const index = parseInt(this.closest('.modal').getAttribute('data-post-index'));
    const name = document.getElementById('volunteer-name').value.trim();
    const type = document.getElementById('volunteer-type').value;
    const skills = document.getElementById('volunteer-skills').value.trim();

    if (name) {
        const helpType = type ? `${type}: ` : '';
        addVolunteer(index, `${name} - ${helpType}${skills || 'Not specified'}`);
        this.reset();
        this.closest('.modal').style.display = 'none';
    }
});

// Toggle donation options
document.getElementById('donate-type').addEventListener('change', function() {
    const type = this.value;
    const moneyOpts = document.getElementById('money-options');
    const itemOpts = document.getElementById('item-options');
    if (type === 'money') {
        moneyOpts.style.display = 'block';
        itemOpts.style.display = 'none';
    } else if (type === 'things' || type === 'food' || type === 'other') {
        moneyOpts.style.display = 'none';
        itemOpts.style.display = 'block';
    } else {
        moneyOpts.style.display = 'none';
        itemOpts.style.display = 'none';
    }
});

// Functions to add actions
function addComment(index, comment) {
    const posts = JSON.parse(localStorage.getItem("voluntraPosts")) || [];
    if (!posts[index].comments) posts[index].comments = [];
    posts[index].comments.push(comment);
    localStorage.setItem("voluntraPosts", JSON.stringify(posts));
    displayPosts(posts);
}

function addDonation(index, donation) {
    const posts = JSON.parse(localStorage.getItem("voluntraPosts")) || [];
    if (!posts[index].donations) posts[index].donations = [];
    posts[index].donations.push(donation);
    localStorage.setItem("voluntraPosts", JSON.stringify(posts));
    displayPosts(posts);
}

function addVolunteer(index, volunteer) {
    const posts = JSON.parse(localStorage.getItem("voluntraPosts")) || [];
    if (!posts[index].volunteers) posts[index].volunteers = [];
    posts[index].volunteers.push(volunteer);
    localStorage.setItem("voluntraPosts", JSON.stringify(posts));
    displayPosts(posts);
}


const footerText = document.querySelector("footer p");
if (footerText) {
    footerText.innerHTML = `© ${new Date().getFullYear()} Voluntra — Making the world better together 🌍`;
}


 
const titleInput = document.getElementById('title');
const priceInput = document.getElementById('price');
const taxesInput = document.getElementById('taxes');
const adsInput = document.getElementById('ads');
const discountInput = document.getElementById('discount');
const totalDisplay = document.getElementById('total');
const countInput = document.getElementById('count');
const categoryInput = document.getElementById('category');
const submitBtn = document.getElementById('submit');
const searchInput = document.getElementById('search');
const tableBody = document.getElementById('tbody');
const deleteAllContainer = document.getElementById('delete-all');

let products = JSON.parse(localStorage.getItem('products')) || [];
let isEditMode = false;
let editingProductIndex = -1;
let searchMode = 'title'; 

function calculateTotal() {
    const price = +priceInput.value;
    const taxes = +taxesInput.value || 0;
    const ads = +adsInput.value || 0;
    const discount = +discountInput.value || 0;

    if (priceInput.value.trim() !== '') {
        const total = price + taxes + ads - discount;
        totalDisplay.textContent = total;
        totalDisplay.style.backgroundColor = '#040';
    } else {
        totalDisplay.textContent = '0';
        totalDisplay.style.backgroundColor = '#690000';
    }
}

document.querySelectorAll('.prices input[type=number]').forEach(input => {
    input.addEventListener('input', calculateTotal);
});

function createRowTemplate(product, index) {
    return `
        <tr>
            <td>${index + 1}</td>
            <td>${product.title}</td>
            <td>${product.price}</td>
            <td>${product.taxes}</td>
            <td>${product.ads}</td>
            <td>${product.discount}</td>
            <td>${product.total}</td>
            <td>${product.category}</td>
            <td><button onclick="editProduct(${index})" id="update">Update</button></td>
            <td><button onclick="deleteProduct(${index})" id="delete">Delete</button></td>
        </tr>
    `;
}

function renderProductsTable(productsToRender = products) {
    let tableRows = '';

    productsToRender.forEach((product, index) => {
        tableRows += createRowTemplate(product, index);
    });

    tableBody.innerHTML = tableRows;

    if (products.length > 0) {
        deleteAllContainer.innerHTML = `
            <button onclick="deleteAllProducts()" id="delete">Delete All (${products.length})</button>
        `;
    } else {
        deleteAllContainer.innerHTML = '';
    }
}

function clearForm() {
    titleInput.value = '';
    priceInput.value = '';
    taxesInput.value = '';
    adsInput.value = '';
    discountInput.value = '';
    countInput.value = '1';
    categoryInput.value = '';
    
    calculateTotal();
}

submitBtn.addEventListener('click', () => {
    if (!titleInput.value.trim() || !priceInput.value.trim()) return;

    const product = {
        title: titleInput.value.trim(),
        price: priceInput.value,
        taxes: taxesInput.value || 0,
        ads: adsInput.value || 0,
        discount: discountInput.value || 0,
        total: totalDisplay.textContent,
        category: categoryInput.value.trim()
    };

    if (!isEditMode) {
        const count = +countInput.value || 1;
        for (let i = 0; i < count; i++) {
            products.push(product);
        }
    } else {
        products[editingProductIndex] = product;
        
        submitBtn.textContent = 'Create';
        countInput.style.display = 'block';
        isEditMode = false;
        editingProductIndex = -1;
    }

    localStorage.setItem('products', JSON.stringify(products));
    clearForm();
    renderProductsTable();
});

function deleteProduct(index) {
    products.splice(index, 1);
    localStorage.setItem('products', JSON.stringify(products));
    renderProductsTable();
}

function editProduct(index) {
    const product = products[index];

    titleInput.value = product.title;
    priceInput.value = product.price;
    taxesInput.value = product.taxes;
    adsInput.value = product.ads;
    discountInput.value = product.discount;
    categoryInput.value = product.category;
    
    calculateTotal();

    countInput.style.display = 'none';
    submitBtn.textContent = 'Update';
    
    isEditMode = true;
    editingProductIndex = index;

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function deleteAllProducts() {
    localStorage.removeItem('products');
    products = [];
    renderProductsTable();
}

function setSearchMode(modeType) {
    if (modeType === 'search-title') {
        searchMode = 'title';
        searchInput.placeholder = 'Search By Title';
    } else {
        searchMode = 'category';
        searchInput.placeholder = 'Search By Category';
    }

    searchInput.value = '';
    searchInput.focus();
    renderProductsTable();
}

searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();
    
    if (!query) {
        renderProductsTable();
        return;
    }

    const filteredProducts = products.filter(product => {
        const targetField = searchMode === 'title' ? product.title : product.category;
        return targetField.toLowerCase().includes(query);
    });

    let tableRows = '';
    filteredProducts.forEach((product, index) => {
        tableRows += createRowTemplate(product, index);
    });

    tableBody.innerHTML = tableRows;
});

renderProductsTable();
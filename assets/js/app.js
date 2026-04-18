// ------------------------
// 初期データ取得
// ------------------------
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function save() {
    if (cart.length === 0) {
        localStorage.removeItem("cart");
    } else {
        localStorage.setItem("cart", JSON.stringify(cart));
    }
}

// ------------------------
// URLパラメータ取得
// ------------------------
const params = new URLSearchParams(window.location.search);
const categoryFromURL = params.get("category");

if (categoryFromURL) {
  const products = document.querySelectorAll(".cat_item");
  const buttons = document.querySelectorAll(".filter_item");

  // フィルター適用
  products.forEach(product => {
    product.style.display =
      categoryFromURL === "all" ||
      product.dataset.category === categoryFromURL
        ? ""
        : "none";
  });

  // ボタン状態
  buttons.forEach(btn => {
    if (btn.value === categoryFromURL) {
      btn.classList.add("active");
    }
  });

  history.replaceState(null, "", "index.html");
}


// ------------------------
// カテゴリー絞り込み
// ------------------------
const filter = document.getElementById("filter");

if (filter) {
    const products = document.querySelectorAll(".cat_item");
    const buttons = document.querySelectorAll(".filter_item");

    buttons.forEach(button => {
        button.addEventListener("click", () => {

            buttons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            const value = button.value;

            products.forEach(product => {
                product.style.display =
                    value === "all" || product.dataset.category === value
                        ? ""
                        : "none";
            });
        });
    });
}


// ------------------------
// お気に入り機能
// ------------------------
document.querySelectorAll(".fav").forEach(btn => {
    btn.addEventListener("click", () => {
        const img = btn.querySelector("img");

        const isActive = btn.classList.toggle("active");

        img.src = isActive ? img.dataset.on : img.dataset.off;
    });
});

// ------------------------
// カート追加
// ------------------------
document.querySelectorAll(".cart").forEach(btn => {
    btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const name = btn.dataset.name;
        const price = Number(btn.dataset.price);

        const existing = cart.find(item => item.id === id);

        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({ id, name, price, qty: 1 });
        }

        save();
        alert("カートに追加しました");
    });
});


// ------------------------
// カートページ描画
// ------------------------
const cartList = document.getElementById("cartList");
const totalPriceEl = document.getElementById("totalPrice");

if (cartList) {
    function renderCart() {
        if (cart.length === 0) {
            cartList.innerHTML = "<li>カートは空です</li>";
            totalPriceEl.textContent = 0;
            return;
        }

        cartList.innerHTML = "";
        let total = 0;

        cart.forEach((item, index) => {
            const li = document.createElement("li");

            li.innerHTML = `<span class="placename">${item.name} - ¥${item.price}</span>

      <span class="crease_box"><button class="decrease">−</button><span>${item.qty}</span><button class="increase">＋</button></span><button class="remove">削除</button>
    `;

            // 数量増やす
            li.querySelector(".increase").addEventListener("click", () => {
                item.qty += 1;
                save();
                renderCart();
            });

            // 数量減らす（1未満にならない）
            li.querySelector(".decrease").addEventListener("click", () => {
                if (item.qty > 1) {
                    item.qty -= 1;
                } else {
                    // 1のときは削除でもOK
                    cart.splice(index, 1);
                }
                save();
                renderCart();
            });

            // 削除ボタン
            li.querySelector(".remove").addEventListener("click", () => {
                cart.splice(index, 1);
                save();
                renderCart();
            });

            cartList.appendChild(li);

            total += item.price * item.qty;
        });

        totalPriceEl.textContent = new Intl.NumberFormat('ja-JP').format(total);
    }

    document.getElementById("clearCart")?.addEventListener("click", () => {
        cart = [];
        save();
        renderCart();
    });

    // 初期表示
    renderCart();
}
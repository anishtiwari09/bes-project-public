export const badgetemplage = (name, compnay, qrcodeLogo, urn) => {
  return `<html>
<head>
  <style>
    .main-div {
      display: flex;
      gap: 1px;
      font-family: sans-serif;
    }
    .front {
      border: 12px solid green;
      padding: 8px;
      width: 280px;
      text-align: center;
    }
    .logo-part-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.6rem;
      font-size: 0.6rem;
      color: #333;
    }
    .big-logo img {
      max-width: 100px;
      margin: auto;
    }
    .qr-code img {
      max-width: 100px;
      margin-top: 10px;
    }
  </style>
</head>
<body>
  <div class="main-div">
    <div class="front">
      <div class="logo-part-header">
        <div>Log1</div>
        <div>Log2</div>
        <div>Log3</div>
      </div>
      <div class="big-logo">
        <img src="https://besindia.com/Images/Logo/logo.png" />
      </div>
      <div class="user-details">
        <h3 class="username">${name}</h3>
        <p>${compnay}</p>
        <div class="qr-code">
          <img src="${qrcodeLogo}" />
        </div>
        <p>${urn}</p>
      </div>
    </div>
    <div class="back"></div>
  </div>
</body>
</html>`;
};

async function shortenUrl() {
    const urlInput = document.getElementById('longUrl');
    let longUrl = urlInput.value.trim();
    const resultDiv = document.getElementById('result');
    const qrCanvas = document.getElementById('qrcode');
  
    if (!longUrl) {
      resultDiv.style.color = 'red';
      resultDiv.textContent = "Please enter a URL!";
      return;
    }
  
    // Add https:// if missing
    if (!/^https?:\/\//i.test(longUrl)) {
      longUrl = 'https://' + longUrl;
    }
  
    resultDiv.textContent = "Shrinking...";
    resultDiv.style.color = "#333";
    qrCanvas.getContext('2d').clearRect(0, 0, qrCanvas.width, qrCanvas.height);
  
    try {
      const res = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`);
      const shortUrl = await res.text();
  
      if (shortUrl.includes("Error")) {
        throw new Error(shortUrl);
      }
  
      resultDiv.innerHTML = `
        ✅ Short URL: <a href="${shortUrl}" target="_blank">${shortUrl}</a><br>
        <button onclick="copyToClipboard('${shortUrl}')">📋 Copy</button>
      `;
      resultDiv.style.color = "green";
  
      QRCode.toCanvas(qrCanvas, shortUrl, { width: 150 });
  
      const stored = JSON.parse(localStorage.getItem('shortLinks')) || [];
      stored.push({ original: longUrl, short: shortUrl });
      localStorage.setItem('shortLinks', JSON.stringify(stored));
      loadHistory();
    } catch (error) {
      console.error("Error:", error);
      resultDiv.style.color = 'red';
      resultDiv.textContent = "Failed to shorten URL. Try again.";
    }
  }
  
  function loadHistory() {
    const historyDiv = document.getElementById('history');
    const stored = JSON.parse(localStorage.getItem('shortLinks')) || [];
    historyDiv.innerHTML = '';
    stored.forEach(link => {
      const linkDiv = document.createElement('div');
      linkDiv.innerHTML = `
        <p><strong>Original URL:</strong> <a href="${link.original}" target="_blank">${link.original}</a></p>
        <p><strong>Shortened URL:</strong> <a href="${link.short}" target="_blank">${link.short}</a></p>
      `;
      historyDiv.appendChild(linkDiv);
    });
  }
  
  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    });
  }
  
  window.onload = loadHistory;
  
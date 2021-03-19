export default async function (url) {
  return new Promise((resolve, reject) => {
    var script = document.createElement('script');
    script.onload = resolve;
    script.onerror = reject;
    script.src = url;
    document.head.appendChild(script);
  })
}
const dropList = document.querySelectorAll("form select"),
	fromCurrency = document.querySelector(".from select"),
	toCurrency = document.querySelector(".to select"),
	getButton = document.querySelector("form button"),
	exchangeIcon = document.querySelector("form .icon");
let requestURL = "https://api.exchangerate.host/latest";

getButton.addEventListener("click", (e) => {
	e.preventDefault();
	getExchangeRate();
});

function getOptionUrl(url) {
	let request = new XMLHttpRequest();
	request.open("GET", url);
	request.responseType = "json";
	request.send();

	request.onload = function () {
		if (request.status !== 200) {
			alert(`Error ${request.status}: ${request.statusText}`); // e.g. 404: Not Found
		}
		let response = request.response;
		const data = response.rates;
		generateOptions(data);
	};
	request.onprogress = function (event) {
		if (event.lengthComputable) {
			alert("Loaded");
		} else {
			alert("loading"); // no Content-Length
		}
	};
	request.onerror = function () {
		alert("Request failed");
	};
}

getOptionUrl(requestURL);

function generateOptions(options) {
	for (let i = 0; i < dropList.length; i++) {
		for (let currency_code in options) {
			let selected =
				i == 0
					? currency_code == "USD"
						? "selected"
						: ""
					: currency_code == "NGN"
					? "selected"
					: "";
			let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
			dropList[i].insertAdjacentHTML("beforeend", optionTag);
		}
	}
}

exchangeIcon.addEventListener("click", () => {
	let tempCode = fromCurrency.value;
	fromCurrency.value = toCurrency.value;
	toCurrency.value = tempCode;
	getExchangeRate();
});

function getExchangeRate() {
	const amount = document.querySelector("form input");
	const exchangeRateTxt = document.querySelector("form .exchange-rate");
	let amountVal = amount.value;
	let fromCurrencyValue = fromCurrency.value;
	let toCurrencyValue = toCurrency.value;

	if (amountVal == "" || amountVal == "0") {
		amount.value = "1";
		amountVal = 1;
	}
	exchangeRateTxt.innerText = "Getting exchange rate...";
	let url = `https://api.exchangerate.host/convert?from=${fromCurrencyValue}&to=${toCurrencyValue}`;
	fetch(url)
		.then((response) => response.json())
		.then((result) => {
			let exchangeRate = result.info.rate;
			let totalExRate = (amountVal * exchangeRate).toFixed(4);
			exchangeRateTxt.innerText = `${amountVal} ${fromCurrencyValue} = ${totalExRate} ${toCurrencyValue}`;
		})
		.catch(() => {
			exchangeRateTxt.innerText = "Something went wrong";
		});
}

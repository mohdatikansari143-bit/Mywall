(function () {
    try {
        var search = window.location.search || '';
        var hash = window.location.hash || '';
        var hasIntroFlag = search.indexOf('intro=1') !== -1;
        if (hasIntroFlag) {
            sessionStorage.setItem('trex_intro_shown', '1');
            var cleaned = search.replace(/([?&])intro=1(&|$)/, function (_, p1, p2) {
                return p1 === '?' && p2 === '&' ? '?' : (p2 === '&' ? p1 : '');
            });
            if (cleaned === '?')
                cleaned = '';
            if (window.history && window.history.replaceState) {
                window.history.replaceState(null, '', window.location.pathname + cleaned + hash);
            }
            return;
        }
        if (!sessionStorage.getItem('trex_intro_shown')) {
            sessionStorage.setItem('trex_intro_shown', '1');
            window.location.replace('starting.html' + search + hash);
        }
    }
    catch (e) { }
})();

function sitemapCateList() {
    var param = {};
    ajaxCall(API_SERVER + "/product/getCategoryList", param, 'post'
    , function (data) {
        
        var sitemapCateHtml = '';
        var result = data.result;
        console.log(sitemapCateHtml);

        for(var i = 0; i < result.length; i++) {
            var category = result[i];
            sitemapCateHtml += '<li>';
            sitemapCateHtml += '    <div>';
            sitemapCateHtml += '        <p><img src="/images/sitemap_arrow.png" alt="화살표"></p>';
            sitemapCateHtml += '        <p>'+ category.category1Name+'</p>';
            sitemapCateHtml += '    </div>';
            sitemapCateHtml += '</li>';
        }

        $('div.sitemap_categ div.sitemap_menuList > ul').html(sitemapCateHtml);
    })
}

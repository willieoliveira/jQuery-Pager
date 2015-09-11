define(['jquery', 'ldsh!pager'], function ($, pagerTmplRenderer) {

	function toNumber(mixed) {
		return parseInt(mixed, 10);
	}

    function getValue(element) {
    	return toNumber($(element).text());
    }

	function Pager(container, options) {

		var options = options || {};

		this.$container = $(container);

		this.pagerSize = options.pagerSize || 9;

		// Quantidade de itens em torno do índice da página atual
    	this.itensAround = Math.floor(this.pagerSize / 2);

    	// Posição a ser utilização pelo índice da página atual
    	this.middleItem = (this.pagerSize + 1) / 2;

		// Índice da página atual
		this.page = options.page || 0,

		// Coleção de índices de páginas a serem exibidas
		this.pageRange = [],

		this.renderer = options.renderer || pagerTmplRenderer;

		this.bookmarks = options.bookmarks || false;
	}

	Pager.prototype = {

		createPageRange: function() {

			var page = this.page,
				totalPages = this.getTotalPages(),
				itensAround = this.itensAround,
				pageRange  = [],
				subLimit, supLimit, padding, index;

			// Menor índice a ser exibido
			subLimit = page - itensAround;

			// Maior índice a ser exibido
			supLimit = page + itensAround;

			if (subLimit <= 0) {
			    subLimit = 1;
			}

			if (totalPages <= supLimit) {
				supLimit = totalPages;
				padding  = itensAround - (supLimit - page);
				subLimit = subLimit - padding;

			} else if (totalPages < this.pagerSize) {
			    supLimit = totalPages;

			} else if (supLimit - subLimit < this.pagerSize) {
			    supLimit = subLimit + this.pagerSize - 1;
			}

			if (subLimit <= 0) {
			    subLimit = 1;
			}

		    if (this.hasBookmarks()) {
		        subLimit = subLimit + 2;
			}

		    //Criação de índices para páginas
		    for (index = subLimit, pageRange = []; index <= supLimit; index++) {
		        pageRange.push(index);
		    }

		    return pageRange;
		},

		getTotalPages: function() {
			return Math.ceil(this.totalSize / this.itemsPerPage);
		},

		isEnabled: function() {
			return this.itemsPerPage < this.totalSize;
		},

		hasPrevious: function() {
			return this.page > 1;
		},

	    isPrev: function(element) {
	        return $(element).is('.pager__item--previous');
	    },

		hasNext: function() {
			return this.page < this.getTotalPages();
		},

		isNext: function(element) {
	        return $(element).is('.pager__item--next');
	    },

		hasBookmarks: function() {
			return this.bookmarks && this.page > this.middleItem &&
						this.getTotalPages() > this.pagerSize;
		},

		setData: function(data) {

			// Número de resultados exibidos por cada página
			this.itemsPerPage = data.itemsPerPage;

			// Índice da página atual
			this.page = data.page;

			// Número total de registros (soma do registros de todas as páginas)
			this.totalSize = data.totalSize;
		},

		getData: function(data) {
			return {
				params: data.params || undefined,

				// Índice da página atual
				page: this.page,

				// Coleção de índices de páginas a serem exibidas
				pageRange: this.createPageRange(),

				// Inclusão de bookmarks para página 1 e 2 e ajuste do limite
				// inferior de índices de paginação
				hasBookmarks: this.hasBookmarks(),

				// Habilitação de link para página anterior
				hasPrevious: this.hasPrevious(),

				// Habilitação de link para próxima página
				hasNext: this.hasNext(),

				// Verificação para renderização do pager
				isEnabled: this.isEnabled()
			};
		},

	    getCurrent: function() {

	    	var $current = this.$container.find('.pager__item--current');

	    	return getValue($current);
	    },

	    generatePage: function(element) {

	    	var current = this.getCurrent();

	        if (this.isPrev(element)) {
	            return current - 1;
	        }

	        if (this.isNext(element)) {
	            return current + 1;
	        }

	        return getValue(element);
	    },

		update: function(data) {

			this.setData(data);

			this.render(this.getData(data));

			this.$container.trigger('pager:render', this);
		},

		render: function(data) {

			this.$container.children().remove();

			if (data.isEnabled) {
				this.$container.html(this.renderer(data));
			}
		},

		paginate: function(element) {

			var page = this.generatePage(element);

			this.$container.trigger('pager:paginate', page);
		},

		bindEvents: function() {

			var that = this;

			function updateHandler(e, data) {
				that.update(data);
			}

			function paginateHandler(e) {
				that.paginate(e.currentTarget);
				e.preventDefault();
			}

	 		this.$container
	 			.on('click.pager', '.pager__item', paginateHandler)
	 			.on('pager:update.pager', updateHandler);
		},

		init: function() {
			this.bindEvents();
		}
	};

	return Pager;
});

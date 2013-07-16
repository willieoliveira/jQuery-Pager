(function ($, undefined) {
  
	$.fn.Pager = function (options) {
		
		var defaults = {
			// Número de índices a serem exibidos
	    	pagerSize: 9,
	    	pageNumberName: 'pageNumber'
	    };
		
		return this.each(function (i, el) {
			(function (options) {
				
				var getPage, createPageRange, renderWidget, renderData, 
					settings, initialize, update;
				
				update = function (data) {
					
					var onAfterUpdate = settings.onAfterUpdate;
					
					renderWidget(data);
					
					if (typeof onAfterUpdate === 'function') {
						onAfterUpdate(data);
					}
				};	
				
				createPageRange = function (map) {
					
					var pagerSize , itensAround, subLimit, supLimit, padding, index,
						_settings  = settings,
						totalPages = map.totalPages, 
						pageNumber = map.pageNumber,
						pageRange  = [];
					
					pagerSize   = _settings.pagerSize;
					itensAround = _settings.itensAround;
					
			
					// Menor índice a ser exibido
					subLimit = pageNumber - itensAround;
			
					// Maior índice a ser exibido
					supLimit = pageNumber + itensAround;

					if (subLimit <= 0) {
					    subLimit = 1;
					}

					if (totalPages <= supLimit) {
						supLimit = totalPages;
						padding  = itensAround - (supLimit - pageNumber);
						subLimit = subLimit - padding;
						
					} else if (totalPages < pagerSize) {
					    supLimit = totalPages;
					    
					} else if (supLimit - subLimit < pagerSize) {
					    supLimit = subLimit + pagerSize - 1;
					}
			
					if (subLimit <= 0) {
					    subLimit = 1;
					}
					
				    if (map.hasBookmarks) {
				        subLimit = subLimit + 2; 
					}
					
				    //Criação de índices para páginas
				    for (index = subLimit, pageRange = []; index <= supLimit; index++) {
				        pageRange.push(index);
				    }
				    
				    return pageRange;
				};
				
				/**
				 * 
				 */
				renderWidget = function (data) {
					
					var itemsPerPage, pageNumber, totalSize, subLimit, supLimit, 
						totalPages, hasPrevious, hasNext, hasBookmarks, index, 
						pageRange, config, _settings;
					
					// Cópia local das configurações
					_settings = settings;
					
					// Número de resultados exibidos por cada página
					itemsPerPage = data.recordsPerPage;

					// Índice da página atual
					pageNumber = data.page;
			
					// Número total de registros (soma do registros de todas as páginas)
					totalSize = data.recordCount;
			
					// Quantidade de páginas para exibição dos registros
					totalPages = Math.ceil(totalSize / itemsPerPage);
					
					// Verificação para renderização do pager
					isPagerEnabled = itemsPerPage < totalSize;
					
				    // Habilitação de link para página anterior
					hasPrevious = pageNumber > 1;
				    
				    // Habilitação de link para próxima página
				    hasNext = pageNumber < totalPages;			
			
					// Inclusão de bookmarks para página 1 e 2 e ajuste do limite 
					// inferior de índices de paginação
				    hasBookmarks = pageNumber > _settings.middleItem && totalPages > _settings.pagerSize;
				    
				    // Coleção de índices de páginas a serem exibidas
				    pageRange = createPageRange({
				    	pageNumber: pageNumber,
						totalPages: totalPages,
						hasBookmarks: hasBookmarks
				    });
					
				    // Configurações para renderização do widget pager
					config = {
						url: settings.url,
						extraParameters: data.extraParameters || undefined,
						pageNumber: pageNumber,
						pageNumberName: settings.pageNumberName,
						pageRange: pageRange,
						hasBookmarks: hasBookmarks,
						hasPrevious: hasPrevious,
						hasNext: hasNext
					};
					
					// Renderização
					$target = $(_settings.target);
					$target.siblings(".pager").remove();
					
					if (isPagerEnabled) {
						$target.after($.tmpl("pagerTemplate", config));
					}
				};
				
				initialize = (function (options) {
					
					settings = $.extend({}, defaults, options);
					
					settings = $.extend(settings, {
						
						// Quantidade de itens em torno do índice da página atual
				    	itensAround: Math.floor(settings.pagerSize / 2),
				    	
				    	// Posição a ser utilização pelo índice da página atual
				    	middleItem: (settings.pagerSize + 1) / 2
					});
					
					$(el).bind("pager:update", function (e, data){
						update(data);
					});
				})(options);
			})(options);
		});
	};
	
})(jQuery);

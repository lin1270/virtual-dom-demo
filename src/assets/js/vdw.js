/* 
    renderDelegate: {
        onDataCount: function() {
            return 100
        },

        onRender: function(index) {

        },

        onRenderItemHeight: function(index) {
            return 20
        }
    }

*/

var VirtualDomWrapper = function(dom, renderDelegate) {
    this.dom = $(dom);
    this.renderDelegate = renderDelegate
    this.domCore = null

    this.calcRenderAreaItems = function(scrollTop, scrollHeight) {
        var top = 0
        var emptyTop = null
        var maxTop = scrollTop + scrollHeight
        var dataCount = this.renderDelegate.onDataCount()
        
        var items = []
        for (var i = 0; i < dataCount; ++i) {
            var itemHeight = this.renderDelegate.onRenderItemHeight(i)

            var theTop = top + itemHeight
            if (theTop >= scrollTop) {
                if (emptyTop === null) {
                    emptyTop = top
                }
                items.push(this.renderDelegate.onRender(i))
            }

            top += itemHeight

            if (theTop > maxTop) {
                break;
            }
        }

        return {items: items, top: emptyTop}
    }

    this.updateRenderArea =  function() {
        var scrollTop = this.dom[0].scrollTop
        var scrollHeight = this.dom.height()
        
        var {items,top} = this.calcRenderAreaItems(scrollTop, scrollHeight)

        this.domCore.empty()

        // 加入一个空的
        if (scrollTop) {
            this.domCore.append('<div style="height:' + top + 'px;"></div>')
        }

        if (items) {
            for(var i = 0; i < items.length; ++i) {
                this.domCore.append(items[i])
            }
        }
    }

    this.reload = function() {
        var self = this
        if (!this.renderDelegate) return

        this.dom.css({
            padding: '0',
            overflow: 'auto'
        })


        // 初始化scroll高度
        var height = 0
        var dataCount = this.renderDelegate.onDataCount()
        for (var i = 0; i < dataCount; ++i) {
            height += this.renderDelegate.onRenderItemHeight(i)
        }

        this.dom.empty()
        this.domCore = $('<div style="width: 100%; height:' + height + 'px;"></div>')
        this.dom.append(this.domCore)

        this.dom.scroll(function(event) {
            self.updateRenderArea()
        })


        // update当前显示区域
        self.updateRenderArea()
    }



    this.reload()
}
// 精选搭配服务
export class OutfitService {
  constructor() {
    // 初始化精选搭配数据
    this.outfits = [
      {
        title: '简约休闲风',
        desc: '适合周末出行，舒适又时尚',
        tag: '休闲日常',
        tagColor: 'white',
        tagText: 'text-neutral-800',
        img: 'https://picsum.photos/seed/outfit1/600/400',
        items: [
          { img: 'https://picsum.photos/seed/item1/100/100', alt: '白色T恤' },
          { img: 'https://picsum.photos/seed/item2/100/100', alt: '牛仔裤' },
          { img: 'https://picsum.photos/seed/item3/100/100', alt: '运动鞋' },
          { more: 2 }
        ],
        liked: false,
        likes: 24
      },
      {
        title: '干练职场风',
        desc: '适合办公室，专业又不失时尚',
        tag: '职场通勤',
        tagColor: 'white',
        tagText: 'text-neutral-800',
        img: 'https://picsum.photos/seed/outfit2/600/400',
        items: [
          { img: 'https://picsum.photos/seed/item4/100/100', alt: '衬衫' },
          { img: 'https://picsum.photos/seed/item5/100/100', alt: '西装裤' },
          { img: 'https://picsum.photos/seed/item6/100/100', alt: '高跟鞋' },
          { more: 1 }
        ],
        liked: true,
        likes: 42
      },
      {
        title: '浪漫约会风',
        desc: '适合约会场合，优雅迷人',
        tag: '约会聚会',
        tagColor: 'white',
        tagText: 'text-neutral-800',
        img: 'https://picsum.photos/seed/outfit3/600/400',
        items: [
          { img: 'https://picsum.photos/seed/item7/100/100', alt: '连衣裙' },
          { img: 'https://picsum.photos/seed/item8/100/100', alt: '耳环' },
          { img: 'https://picsum.photos/seed/item9/100/100', alt: '手包' }
        ],
        liked: false,
        likes: 18
      }
    ]
  }

  // 获取所有精选搭配
  getOutfits() {
    return this.outfits
  }

  // 根据标签获取搭配
  getOutfitsByTag(tag) {
    return this.outfits.filter(outfit => outfit.tag === tag)
  }

  // 切换搭配的喜欢状态
  toggleLike(outfitTitle) {
    const outfit = this.outfits.find(o => o.title === outfitTitle)
    if (outfit) {
      outfit.liked = !outfit.liked
      if (outfit.liked) {
        outfit.likes++
      } else {
        outfit.likes--
      }
      return outfit
    }
    return null
  }

  // 添加新搭配
  addOutfit(outfit) {
    this.outfits.push(outfit)
    return outfit
  }

  // 删除搭配
  removeOutfit(outfitTitle) {
    const index = this.outfits.findIndex(o => o.title === outfitTitle)
    if (index !== -1) {
      return this.outfits.splice(index, 1)[0]
    }
    return null
  }
}

// 创建单例实例
export const outfitService = new OutfitService()

const puppeteer = require('puppeteer')
const fs = require('fs')
;(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  const general = []
  await page.setViewport({
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1
  })
  await page.goto(
    'https://www.linkedin.com/login?fromSignIn=true&trk=guest_homepage-basic_nav-header-signin'
  )
  //linkedin user email and password//
  await page.type('#username', 'andersongds37@gmail.com')
  await page.type('#password', 'pp181121')

  await page.click('[type="submit"]')
  await page.waitForTimeout(5000)

  const object = [
    //fetch appi get
    {
      carrers: ['software engineer', 'cto', 'artist'],
      countrie: ['Brazil', 'united states']
    }
  ]
  for (const itemobject of object) {
    for (const itemCarrer of itemobject.carrers) {
      await page.waitForTimeout(5000)
      const element = await page.$('[type="text"]')
      await element.click({ clickCount: 3 })
      await page.type('[type="text"]', itemCarrer)
      await page.keyboard.press('Enter')
      await page.waitForTimeout(10000)
      await page.click('[class="search-reusables__primary-filter"]')
      await page.waitForTimeout(10000)

      for (const itemCountrie of itemobject.countrie) {
        //Enter Desired Country for Search//
        const count = await page.$('[class="jobs-search-box__text-input"]')
        await count.click({ clickCount: 3 })
        await page.type('[class="jobs-search-box__text-input"]', itemCountrie)
        await page.keyboard.press('Enter')
        await page.waitForTimeout(5000)

        const titlist = await page.evaluate(() => {
          const nodeList = document.querySelectorAll('header h1, small')
          const h1Array = [...nodeList]

          const titlist = h1Array.map(({ textContent }) => ({
            textContent
          }))

          return titlist
        })
        await page.click('[class="search-reusables__primary-filter"]')
        await page.waitForTimeout(5000)
        await page.keyboard.press('ArrowDown')
        await page.keyboard.press('ArrowDown')
        await page.keyboard.press('Enter')
        await page.waitForTimeout(5000)

        const [elements] = await page.$x(
          '//*[@id="search-reusables__filters-bar"]/ul/li[4]'
        )
        await elements.click()
        await page.waitForTimeout(5000)
        const [element] = await page.$x("(//input[@type='text'])[2]")
        await element.type(itemCountrie)
        await page.waitForTimeout(5000)
        await page.keyboard.press('ArrowDown')
        await page.waitForTimeout(5000)
        await page.keyboard.press('Enter')
        await page.waitForTimeout(5000)
        await page.click('[class="artdeco-button__text"]')
        await page.waitForTimeout(10000)

        const info = await page.evaluate(() => {
          const nodeList = document.querySelectorAll(
            '#main .search-results-container  h2'
          )
          const h2Array = [...nodeList]

          const info = h2Array.map(({ textContent }) => ({
            textContent
          }))

          return info
        })

        general.push(titlist.concat(info))
        await page.click('[class="search-reusables__primary-filter"]')
        await page.waitForTimeout(5000)
        await page.keyboard.press('ArrowDown')
        await page.keyboard.press('ArrowDown')
        await page.keyboard.press('ArrowDown')
        await page.keyboard.press('Enter')
        await page.waitForTimeout(5000)
      }
      await page.goto('https://www.linkedin.com/feed/')
    }
  }
  fs.writeFile('Linkedin.json', JSON.stringify(general, null, 2), err => {
    if (err) throw new Error('something went wrong')
    console.log('well done!')
  })

  await browser.close()
})()

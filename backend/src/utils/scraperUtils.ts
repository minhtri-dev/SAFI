import { Builder, By, WebDriver } from 'selenium-webdriver'

async function scrapeElements(
  driver: WebDriver,
  url: string,
  selectors: string[],
): Promise<Record<string, string[]>> {
  try {
    await driver.get(url)
    const elements: Record<string, string[]> = {}

    for (const selector of selectors) {
      const matchedElements = await driver.findElements(By.css(selector))
      elements[selector] = []

      for (const element of matchedElements) {
        const text = await element.getText()
        elements[selector].push(text.trim())
      }
    }

    return elements
  } catch (error) {
    console.error(`Error scraping ${url}:`, error)
    return {}
  }
}

export async function scraper(
  url: string,
  selectors: string[],
): Promise<Record<string, string[]>> {
  let driver = await new Builder().forBrowser('chrome').build()

  try {
    await driver.get(url)
    const data = await scrapeElements(driver, url, selectors)
    console.log(data)
    return data
  } catch (err) {
    console.error(err)
    return {}
  } finally {
    await driver.quit()
  }
}

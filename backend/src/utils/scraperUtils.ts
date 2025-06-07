import { Builder, By, WebDriver, until } from 'selenium-webdriver'

async function scrapeElements(
  driver: WebDriver,
  url: string,
  selectors: string[],
): Promise<Record<string, string[]>> {
  try {
    const elements: Record<string, string[]> = {}

    for (const selector of selectors) {
      const matchedElements = await driver.findElements(By.css(selector))
      elements[selector] = []

      for (const element of matchedElements) {
        const text = (await element.getText()).trim()
        // Cut empty text
        if (text != "") {
          elements[selector].push(text)
        }  
        
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
  buttonSelector: string,
): Promise<Record<string, any>> {
  let driver = await new Builder().forBrowser('chrome').build()
  try {
    await driver.get(url)

    if (buttonSelector === '') {
      return await scrapeElements(driver, url, selectors)
    }
    const allData: Record<string, Record<string, string[]>> = {}
    let buttons = await driver.findElements(By.css(buttonSelector))

    for (let i = 0; i < buttons.length; i++) {
      try {
        // Re-find buttons before each click
        buttons = await driver.findElements(By.css(buttonSelector))

        const button = buttons[i]

        // Make sure the button is interactable
        await driver.wait(until.elementIsVisible(button), 1000)
        const buttonText = await button.getText()
        // console.log(`Clicking button: ${buttonText}`)

        await button.click()

        // TODO: Add a wait condition to ensure the page has updated for when button is clicked
        // await driver.wait(
        //   until.elementLocated(By.css('some-result-selector')),
        //   1000,
        // )
        await driver.sleep(500)

        // Scrape data after the button click
        const data = await scrapeElements(driver, url, selectors)
        allData[buttonText] = data
      } catch (error) {
        console.error('Failed to interact with button', error)
      }
    }

    return allData
  } catch (err) {
    console.error(err)
    return {}
  } finally {
    await driver.quit()
  }
}

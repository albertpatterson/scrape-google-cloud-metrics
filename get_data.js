export function getData() {
  const tableWrapperEls = Array.from(
    document.getElementsByClassName('devsite-table-wrapper')
  );
  const serviceInfoAll = [];
  const serviceMetricsInfoAll = [];

  let serviceIndex = 0;
  for (const tableWrapperEl of tableWrapperEls) {
    const serviceInfo = getServiceInfo(tableWrapperEl, serviceIndex);
    serviceInfoAll.push(serviceInfo);

    const serviceMetricsInfo = getServiceMetricsInfo(
      tableWrapperEl,
      serviceIndex
    );
    serviceMetricsInfoAll.push(...serviceMetricsInfo);

    serviceIndex++;
  }

  return { service: serviceInfoAll, serviceMetrics: serviceMetricsInfoAll };

  /**
   *
   * @param {HTMLElement} tableWrapperEl
   * @param {number} serviceIndex
   * @returns
   */
  function getServiceMetricsInfo(tableWrapperEl, serviceIndex) {
    const trEls = Array.from(
      tableWrapperEl.querySelector('tbody').querySelectorAll('tr')
    );

    const serviceMetricsInfo = [];

    let index = 0;
    while (index < trEls.length) {
      const metricInfoWrapperEl = trEls[index];
      const dataInfoWrapperEl = trEls[index + 1];

      const metricInfo = getMetricInfo(metricInfoWrapperEl);
      const dataInfo = getDataInfo(dataInfoWrapperEl);
      const allInfo = { metricInfo, dataInfo, serviceIndex };
      serviceMetricsInfo.push(allInfo);

      index += 2;
    }

    return serviceMetricsInfo;
  }

  /**
   *
   * @param {HTMLElement} metricInfoWrapperEl
   * @returns
   */
  function getMetricInfo(metricInfoWrapperEl) {
    assert(metricInfoWrapperEl, 'metricInfoWrapperEl not defined');
    assert(
      metricInfoWrapperEl.classList.contains('met_type'),
      'missing class for typeEl'
    );

    const nameEl = metricInfoWrapperEl.firstElementChild.firstElementChild;
    assert(nameEl.tagName === 'CODE', 'invalid tag name');
    const name = nameEl.innerText.trim();

    const launchStatusEl = nameEl.nextElementSibling;
    assert(launchStatusEl.tagName === 'SUP', 'invalid launch status name');
    const launchStatus = launchStatusEl.innerText.trim();

    const displayNameEl = metricInfoWrapperEl.firstElementChild.lastChild;
    const displayName = displayNameEl.textContent.trim();

    return { name, launchStatus, displayName };
  }

  /**
   *
   * @param {HTMLElement} dataInfoWrapperEl
   */
  function getDataInfo(dataInfoWrapperEl) {
    assert(dataInfoWrapperEl, 'dataInfoWrapperEl not defined');
    assert(
      dataInfoWrapperEl.classList.contains('met_desc'),
      'missing class for typeEl'
    );
    const leftCol = dataInfoWrapperEl.firstElementChild;
    assert(leftCol?.tagName === 'TD', 'invalid left col');

    const kindEl = leftCol.firstElementChild;
    assert(kindEl?.tagName === 'CODE', 'invalid kindEl');
    const kind = kindEl.innerText.trim();

    const typeEl = kindEl.nextElementSibling;
    assert(typeEl?.tagName === 'CODE', 'invalid typeEl');
    const type = typeEl.innerText.trim();

    const unitEl = typeEl.nextElementSibling;
    assert(unitEl?.tagName === 'CODE', 'invalid unitEl');
    const unit = unitEl.innerText.trim();

    const monitoredResourcesEl = unitEl.nextElementSibling.nextElementSibling;
    assert(
      monitoredResourcesEl?.tagName === 'B',
      'invalid monitoredResourcesEl'
    );
    const monitoredResources = monitoredResourcesEl.innerText.trim();

    const rightCol = leftCol.nextElementSibling;
    assert(rightCol?.tagName === 'TD', 'invalid left col');

    const descriptionEl = rightCol.firstElementChild;
    assert(descriptionEl?.tagName === 'I', 'invalid descEl');
    const description = descriptionEl.innerText.trim();

    const labels = getDataLabels(descriptionEl);

    return { kind, type, unit, monitoredResources, description, labels };
  }

  /**
   *
   * @param {HTMLElement} descEl
   */
  function getDataLabels(descEl) {
    const labels = [];

    // let startEl = descEl;
    let brEl = descEl.nextElementSibling;

    while (true) {
      if (brEl === null) {
        break;
      }

      assert(brEl?.tagName === 'BR', 'invalid label br');

      const labelParts = [];
      let lookEl = brEl.nextSibling;
      while (lookEl && lookEl.tagName !== 'BR') {
        labelParts.push((lookEl.innerText || lookEl.textContent).trim());
        lookEl = lookEl.nextSibling;
      }

      labels.push(labelParts.join(' '));

      brEl = lookEl;
    }

    return labels;
  }

  function assert(test, msg) {
    if (!test) {
      throw new Error(msg);
    }
  }

  /**
   *
   * @param {HTMLElement} tableWrapperEl
   * @param {number} serviceIndex
   * @returns
   */
  function getServiceInfo(tableWrapperEl, serviceIndex) {
    const metricTypeDescriptionEl = tableWrapperEl.previousElementSibling;
    const metricTypeLaunchStagesEl =
      metricTypeDescriptionEl.previousElementSibling;
    const metricTypeNameEl = metricTypeLaunchStagesEl.previousElementSibling;

    const metricTypeJson = {
      name: metricTypeNameEl.innerText.trim(),
      launchStates: metricTypeLaunchStagesEl.innerText.trim(),
      description: metricTypeDescriptionEl.innerText.trim(),
      serviceIndex,
    };

    return metricTypeJson;
  }
}

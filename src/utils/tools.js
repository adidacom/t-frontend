import { useEffect, useRef } from 'react';
import passwordStrengthTest from 'owasp-password-strength-test';
import { detect } from 'detect-browser';

// Converts array of paths to a tree structure
// Assumes data and each path is unique!
// First element of each path must be identical!
export function pathArrayToTree(pathArray) {
  const tree = {
    name: pathArray[0][0],
    path: [pathArray[0][0]],
    children: [],
    selected: false,
  };

  for (let i = 0; i < pathArray.length; i++) {
    const path = pathArray[i];
    let currentNode = tree;
    for (let j = 1; j < path.length; j++) {
      let childFound = false;
      let nextNode;
      for (let k = 0; k < currentNode.children.length; k++) {
        const currentChild = currentNode.children[k];
        if (currentChild.name === path[j]) {
          childFound = true;
          nextNode = currentChild;
          break;
        }
      }

      if (!childFound) {
        const newChild = {
          name: path[j],
          path: path.slice(0, j + 1),
          children: [],
          selected: false,
        };
        currentNode.children.push(newChild);
        nextNode = newChild;
      }
      currentNode = nextNode;
    }
  }

  return tree;
}

export function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email));
}

export const getLastElement = (arr) => arr[arr.length - 1];

/* Password Strength Tools */
passwordStrengthTest.config({
  allowPassphrases: false,
  maxLength: 64,
  minLength: 7,
  minOptionalTestsToPass: 3,
});

export function checkPasswordStrength(password) {
  const result = passwordStrengthTest.test(password);
  if (result.strong) return result;

  for (let i = 0; i < result.errors.length; i++) {
    result.errors[i] = result.errors[i].substring(0, result.errors[i].indexOf('.'));
  }

  // TODO: Find better solution here
  if (
    result.errors[0] ===
    'The password may not contain sequences of three or more repeated characters'
  ) {
    result.errors[0] = 'The password cannot have 3 repeating characters';
  }

  return result;
}

/* Browser Detection Tools */

const mobilesOS = ['iOS', 'Android OS', 'BlackBerry OS', 'Windows Mobile', 'Amazon OS'];
const browser = detect();

export function isMobileDevice() {
  return mobilesOS.indexOf(browser.os) > -1;
}

export function isIEorEdge() {
  return browser.name === 'ie' || browser.name === 'edge';
}

export function isChrome() {
  return browser.name === 'chrome';
}

export function isFirefox() {
  return browser.name === 'firefox';
}

export function isModernChrome() {
  if (!isChrome) return false;
  return Number(browser.version.split('.')[0]) > 60;
}

// Custom Hook to use previous value in update
export const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

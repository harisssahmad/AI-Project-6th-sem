require("dotenv").config();

const Groq = require("groq-sdk");
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});
async function main() {
  const chatCompletion = await getGroqChatCompletion();
  const jsonResponse = JSON.parse(chatCompletion.choices[0]?.message?.content); // Parse the response as JSON
  // console.log(chatCompletion.choices[0]?.message?.content || "");
  console.log(jsonResponse);
}

const task = `Regression Task with Boston Housing Dataset:

Load the Boston Housing dataset (load_boston()) from sklearn.datasets.
Split the dataset into training and testing sets.
Implement a regression model (e.g., Linear Regression, Random Forest) to predict house prices.
Calculate and analyze the model's performance using metrics like mean squared error.`;

const codeA = `task2_data = pd.read_csv('/content/boston_house_prices.csv', header=1)
task2_data.head()

task2_data.plot.scatter('RM', 'MEDV')

from sklearn.linear_model import LinearRegression

X = task2_data[['CRIM', 'ZN', 'INDUS', 'CHAS', 'NOX', 'RM', 'AGE', 'DIS', 'RAD', 'TAX', 'PTRATIO', 'LSTAT']]
Y = task2_data['MEDV']

X_train, X_test, Y_train, Y_test = train_test_split(X, Y)

LR = LinearRegression()

LR.fit(X_train,Y_train)
predictions = LR.predict(X_test)

plt.scatter(Y_test,predictions)
plt.xlabel('Y Test')
plt.ylabel('Predicted Y')

from sklearn import metrics

print('[INFO]\tMean Absolute Error:\t', metrics.mean_absolute_error(Y_test, predictions))
print('[INFO]\tMean Squared Error:\t', metrics.mean_squared_error(Y_test, predictions))
print('[INFO]\tRoot Mean Squared Error:', np.sqrt(metrics.mean_squared_error(Y_test, predictions)))`;

const codeB = `from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error
import matplotlib.pyplot as plt

data_t2 = pd.read_csv('/content/sample_data/boston_house_prices.csv', header=1)

x_arr=['CRIM', 'ZN', 'INDUS', 'CHAS', 'NOX', 'RM', 'AGE', 'DIS', 'RAD', 'TAX', 'PTRATIO', 'LSTAT']

X = data_t2[x_arr]
y = data_t2['MEDV']

X_train, X_test, y_train, y_test = train_test_split(X, y)

linReg = LinearRegression()
linReg.fit(X_train, y_train)

forMod = RandomForestRegressor()
forMod.fit(X_train, y_train)

linPred = linReg.predict(X_test)
forPred = forMod.predict(X_test)

mseLin = mean_squared_error(y_test, linPred)
mseFor = mean_squared_error(y_test, forPred)

plt.figure()
plt.scatter(y_test, linPred, color='blue', label='Actual vs Predicted (Linear Regression)')
plt.plot([min(y_test), max(y_test)], [min(y_test), max(y_test)], color='red', linestyle='--')
plt.xlabel('Actual House Prices')
plt.ylabel('Predicted House Prices')
plt.title('Actual vs Predicted House Prices (Linear Regression)')
plt.legend()
plt.show()

plt.figure()
plt.scatter(y_test, forPred, color='green', label='Actual vs Predicted (Random Forest Regressor)')
plt.plot([min(y_test), max(y_test)], [min(y_test), max(y_test)], color='red', linestyle='--')
plt.xlabel('Actual House Prices')
plt.ylabel('Predicted House Prices')
plt.title('Actual vs Predicted House Prices (Random Forest Regressor)')
plt.legend()
plt.show()


print("Linear Regression MSE:")
print(mseLin)

print("Random Forest MSE:")
print(mseFor)`;

async function getGroqChatCompletion() {
  return await groq.chat.completions.create({
    model: "mixtral-8x7b-32768",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant that evaluates code samples and detects plagiarism. Give answer as a JSON object",
      },
      {
        role: "user",
        content: `You've been presented with two code samples (Code A and Code B) that aim to solve the same problem, which is to ${task}. My task is to thoroughly evaluate both codes and provide feedback on the following aspects:

                1. **Code Understanding**: Can the code correctly solve the problem as stated?
                2. **Code Quality**: Is the code well-structured, readable, and maintainable?
                3. **Originality**: Does the code demonstrate unique and original thinking, or does it show signs of plagiarism?
                4. **Task Achievement**: Does the code successfully achieve the desired outcome?
                
                You will score each code sample out of 5 points for each aspect, providing feedback on the strengths and weaknesses of each code. Additionally, You will investigate potential plagiarism by comparing the two code samples, checking for similarities in syntax, structure, and functionality.
                
                **Code A**:
                
                ${codeA}
                
                **Code B**:
                
                ${codeB}
                
                Give response in the form:
                {
                  "code_a": {
                    "code_understanding": number,
                    "code_quality": number,
                    "originality": number,
                    "task_achievement": number,
                    "feedback": small feedback
                  },
                  "code_b": {
                    "code_understanding": number,
                    "code_quality": number,
                    "originality": number,
                    "task_achievement": number,
                    "feedback": small feedback
                  },
                  "plagiarism": {
                    small comment
                  }
                }`,
      },
    ],
  });
}

module.exports = {
  main,
  getGroqChatCompletion,
};

main();

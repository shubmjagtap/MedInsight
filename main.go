package main

import (
	"encoding/csv"
	"encoding/json"
	"fmt"
	"os"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

// structure for storing in SQL database
type Order struct {
	ID          string
	City        string
	State       string
	IsCOD       string
	Status      string
	Total       string
	Category    string
	Quantity    string
	ProductName string
}

var db *gorm.DB

// function to insert in sql
func insert(row []string) {

	// fill the data
	order := Order{
		ID:          row[0],
		City:        row[1],
		State:       row[2],
		IsCOD:       row[3],
		Status:      row[4],
		Total:       row[5],
		Category:    row[6],
		Quantity:    row[7],
		ProductName: row[8],
	}

	// insert in database
	db.Create(&order)
}

// function to read the orders
func readOrders() {
	// Open the CSV file
	file, err := os.Open("orders.csv")
	if err != nil {
		fmt.Println("Error opening file:", err)
		return
	}
	defer file.Close()

	// Create a new CSV reader
	reader := csv.NewReader(file)

	// Read the header row
	header, err := reader.Read()
	if err != nil {
		fmt.Println("Error reading header:", err)
		return
	}

	// Find the indices of the columns to read
	columnIndices := make(map[int]bool)
	for i, column := range header {
		switch column {
		case "ID", "City", "State", "isCOD", "Status", "Total", "Category", "Quantity", "Product Name":
			columnIndices[i] = true
		}
	}

	// Read and print the rows, including only the specified columns
	for {
		row, err := reader.Read()
		if err != nil {
			break
		}

		// Create a new row with only the specified columns
		var newRow []string
		for i, value := range row {
			if columnIndices[i] {
				newRow = append(newRow, value)
			}
		}

		// Print the modified row with commas between columns
		if len(newRow) > 0 {
			fmt.Println(strings.Join(newRow, ", "))
			insert(newRow)
		}
	}

	fmt.Println("Data Read !!!")
}

func Connect() {
	connection, err := gorm.Open(mysql.Open("root:@/medinsight"), &gorm.Config{})

	if err != nil {
		panic("could not connect to the database")
	}

	db = connection

	connection.AutoMigrate(&Order{})
}

func countIsCOD() []struct {
	IsCOD string
	Count int64
} {
	var results []struct {
		IsCOD string
		Count int64
	}
	db.Table("orders").
		Select("is_cod, COUNT(*) AS Count").
		Group("is_cod").
		Scan(&results)

	return results
}

func getStatusCode() []struct {
	Status string
	Count  int64
} {
	var results []struct {
		Status string
		Count  int64
	}
	db.Table("orders").
		Select("Status, COUNT(*) AS Count").
		Group("Status").
		Scan(&results)

	return results
}

func readRandomLines() {
	var orders []Order

	// Retrieve 5 random orders
	db.Order("RAND()").Limit(5).Find(&orders)

	fmt.Println("Random Orders:")
	for _, order := range orders {
		fmt.Printf("[%s, %s,  %s, %s, %s, %s, %s, %s, %s]\n",
			order.ID, order.City, order.State, order.IsCOD, order.Status, order.Total, order.Category, order.Quantity, order.ProductName)
	}
}

func getRadarData() []struct {
	Total    string
	Quantity string
	Status   string
} {
	var results []struct {
		Total    string
		Quantity string
		Status   string
	}
	db.Table("orders").
		Select("Total, Quantity, Status").
		Scan(&results)

	return results
}

func handleGetCount(c *fiber.Ctx) error {
	data := getStatusCode()
	// Convert data to JSON format
	dataJSON, err := json.Marshal(data)
	if err != nil {
		return err
	}
	c.Type("application/json")
	return c.Send(dataJSON)
}

func handleGetStatus(c *fiber.Ctx) error {
	data := countIsCOD()
	// Convert data to JSON format
	dataJSON, err := json.Marshal(data)
	if err != nil {
		return err
	}
	c.Type("application/json")
	return c.Send(dataJSON)
}

func handleGetRadar(c *fiber.Ctx) error {
	data := getRadarData()
	// Convert data to JSON format
	dataJSON, err := json.Marshal(data)
	if err != nil {
		return err
	}
	c.Type("application/json")
	return c.Send(dataJSON)
}

func main() {
	Connect()

	app := fiber.New()

	app.Use(cors.New())

	// Endpoint for GET on /count
	app.Get("/count", handleGetCount)

	// Endpoint for GET on /status
	app.Get("/pie", handleGetStatus)

	// Endpoint for GET on /radar
	app.Get("/radar", handleGetRadar)

	err := app.Listen(":8000")
	if err != nil {
		panic(err)
	}
}

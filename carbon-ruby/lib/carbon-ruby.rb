class CarbonRuby
  def self.present(schema)
    attributes = {}

    schema.each do |key, data|

      if (data.kind_of?(Array))
        resource = self.try(key)
        attributes[key] = {}

        if resource.kind_of?(Array)
          resource.each do |r|
            attributes[key][r.id] = {}
            data.each do |value|
              attributes[key][r.id][value] = r.try(value)
            end
          end
        elsif resource
          data.each do |value|
            if value.kind_of?(Hash)
              value.each do |k, v|
                collection = resource.try(k)
                attributes[key][k] = {}
                collection.each do |c|
                  attributes[key][k][c.id] = {}
                  v.each do |x|
                    attributes[key][k][c.id][x] = c.try(x)
                  end
                end
              end
            else
              attributes[key][value] = resource.try(value)
            end
          end
        end
      else
        attributes[key] = self.try(data) 
      end
    end

    attributes
  end
end
